#!/usr/bin/env python3

import sys
import os
import subprocess
import shutil
import time
import argparse
import pyinotify
import asyncio

from scss import compiler
from jsmin import jsmin
from cssmin import cssmin

build_dir = "build"
dist_dir = "dist"
config = dict(
	build_dir=build_dir,
	release_dir=dist_dir,
	scss=dict(
		in_dir="src/scss",
		out_dir=os.path.join("src", "css"),
		ext=["scss"],
		release_file=os.path.join(dist_dir, "css", "main.css")
	),
	dotjs=dict(
		in_dir="src/templates",
		out_dir=os.path.join(build_dir, "dot"),
		ext=["dot", "html"],
		# release_file=os.path.join(dist_dir, "js", "templates.js")
	),
	requirejs=dict(
		build_spec="require.build.js",
		release_file=os.path.join(dist_dir, "js", "app.js")
	)
)


class Builder(object):
	def __init__(self, config):
		self._cfg = config
		self._result_files = dict(
			css=[],
			dotjs=[]
		)

	def _match_ext(self, fname, ext):
		ext = ext if isinstance(ext, list) else [ext]
		for item in ext:
			if fname.endswith("." + item):
				return True
		return False

	def _replace_ext(self, fname, ext, result_ext):
		ext = ext if isinstance(ext, list) else [ext]
		for item in ext:
			if fname.endswith("." + item):
				fname = fname.rstrip(item)
				return fname + result_ext
		raise Exception("_replace_ext - no extentions matched")

	def _iter_files(self, in_dir, ext):
		for (root, dirs, files) in os.walk(in_dir):
			for f in files:
				if "#" in f or f.startswith("."):
					continue
				if self._match_ext(f, ext):
					yield os.path.join(root, f)

	def _mk_dest_fpath(self, dest_dir, src_dir, fname):
		fpath = os.path.join(dest_dir, fname.split(src_dir + os.path.sep)[1])
		if not os.path.isdir(os.path.dirname(fpath)):
			os.makedirs(os.path.dirname(fpath))
		return fpath

	def _run_cmd(self, args, **kwargs):
		out_fh = None
		proc = subprocess.Popen(
			args,
			stdout=subprocess.PIPE,
			stderr=subprocess.PIPE
		)
		while proc.poll() is None:
			err = proc.stderr.read()
			out = proc.stdout.read()
			if err:
				sys.stderr.write("ERROR>>> " + err.decode("utf8"))
				sys.stderr.flush()
			if out:
				sys.stdout.write(">>> " + out.decode("utf8"))
				sys.stdout.flush()
		if proc.returncode:
			raise Exception("Failed command:\n%s" % " ".join(args))

	def _concat_files(self, files, result_file, comment=""):
		outfile = result_file
		destdir = os.path.dirname(outfile)
		if not os.path.isdir(destdir):
			print("Creating directory", outfile)
			os.makedirs(destdir)
		print("Joining files into:", outfile)
		with open(outfile, "w") as ofh:
			for infile in files:
				st = os.stat(infile)
				print("\t-> [ %-.2fK ] %s" % ((st.st_size / 1024), infile))
				with open(infile, "r") as ifh:
					ofh.write(ifh.read())

	def _copy_file(self, src, dst):
		print("Copying %s -> %s" % (src, dst))
		if not os.path.isdir(dst):
			dname = os.path.dirname(dst)
			if not os.path.isdir(dname):
				print("Creating directory", dname)
				os.makedirs(dname)
		shutil.copy2(src, dst)

	def _rebuild(self, *args):
		self.run_scss()
		self.run_dot()

	def _add_watch_dir(self, watcher, directory, mask):
		for (root, dirs, files) in os.walk(directory):
			for f in files:
				if "#" in f or f.startswith("."):
					continue
				watcher.add_watch(
					os.path.join(root, f),
					mask
				)
		
	def watch(self):
		watcher = pyinotify.WatchManager()
		loop = asyncio.get_event_loop()
		notifier = pyinotify.AsyncioNotifier(
			watcher, loop,
			callback=self._rebuild
		)

		mask = pyinotify.IN_CLOSE_WRITE | pyinotify.IN_CREATE | pyinotify.IN_MODIFY
		self._add_watch_dir(watcher, self._cfg["scss"]["in_dir"], mask)
		self._add_watch_dir(watcher, self._cfg["dotjs"]["in_dir"], mask)
		loop.run_forever()
		notifier.stop()

	def run_scss(self):
		c = compiler.Compiler(
			search_path=[
				"src/vendor/bootstrap-sass/assets/stylesheets",
				"src/scss"
			]
		)
		in_dir = self._cfg.get("scss", {}).get("in_dir", ".")
		out_dir = self._cfg.get("scss", {}).get("out_dir", build_dir)
		ext = self._cfg.get("scss", {}).get("ext", "scss")

		for f in self._iter_files(in_dir, ext):
			with open(f, "r") as fh:
				fpath = self._replace_ext(
					self._mk_dest_fpath(out_dir, in_dir, f), ext, "css"
				)
				print("SCSS:", f, "->", fpath)
				with open(fpath, "w") as o:
					# o.write(cssmin(c.compile_string(fh.read())))
					o.write(c.compile_string(fh.read()))
					self._result_files["css"].append(fpath)

	def run_dot(self):
		in_dir = self._cfg.get("dotjs", {}).get("in_dir", None)
		out_dir = self._cfg.get("dotjs", {}).get("out_dir", build_dir)
		ext = self._cfg.get("dotjs", {}).get("ext", ["dot", "html"])
		dev_dir = os.path.join("src", "js", "templates")

		for f in self._iter_files(in_dir, ext):
			fpath = self._replace_ext(
				self._mk_dest_fpath(out_dir, in_dir, f), ext, "js"
			)
			dev_fpath = self._replace_ext(
				self._mk_dest_fpath(dev_dir, in_dir, f), ext, "js"
			)
			print("doT:", f, "->", fpath, dev_fpath)
			cmd_args = ["node", "scripts/dot-compile.js", f, dev_fpath]
			output = self._run_cmd(cmd_args, writefile=fpath)
			self._result_files["dotjs"].append(fpath)

	def run_requirejs(self):
		build_spec = self._cfg.get("requirejs", {}).get("build_spec", None)
		print("RequireJS", build_spec)
		cmd_args = ["./node_modules/requirejs/bin/r.js", "-o", build_spec]
		self._run_cmd(cmd_args)

	def build_release(self):
		print("Removing directory:", self._cfg["release_dir"])
		shutil.rmtree(self._cfg["release_dir"], ignore_errors=True)
		asctime = time.asctime()
		default_comment = "/* Built: %s */" % asctime

		self._concat_files(
			self._result_files["css"],
			self._cfg["scss"]["release_file"],
			comment=default_comment
		)

		src_file = "build/js/main.js"
		dest_file = os.path.join(
			self._cfg["release_dir"], "js", os.path.basename(src_file)
		)
		self._copy_file(src_file, dest_file)

		src_file = "src/index.html"
		dest_file = self._cfg["release_dir"]
		self._copy_file(src_file, dest_file)

		vendor_requirejs_dir = os.path.join(
			self._cfg["release_dir"], "vendor", "requirejs"
		)
		if not os.path.isdir(vendor_requirejs_dir):
			os.makedirs(vendor_requirejs_dir)
			with open("src/vendor/requirejs/require.js", "r") as ifh:
				outf = os.path.join(vendor_requirejs_dir, "require.js")
				with open(outf, "w") as ofh:
					ofh.write(jsmin(ifh.read()))

		vendor_bootstrap_fonts_dir = os.path.join(
			self._cfg["release_dir"], "vendor", "bootstrap-sass/assets/fonts"
		)
		if os.path.isdir(vendor_bootstrap_fonts_dir):
			shutil.rmtree(vendor_bootstrap_fonts_dir)
		shutil.copytree(
			"src/vendor/bootstrap-sass/assets/fonts",
			vendor_bootstrap_fonts_dir
		)

		# vendor_bootstrap_dir = os.path.join(*[
		# 	self._cfg["release_dir"], "vendor",
		# 	"bootstrap-sass", "assets", "javascripts"
		# ])
		# if not os.path.isdir(vendor_bootstrap_dir):
		# 	os.makedirs(vendor_bootstrap_dir)
		# self._copy_file(
		# 	"src/vendor/bootstrap-sass/assets/javascripts/bootstrap.min.js",
		# 	vendor_bootstrap_dir
		# )


if __name__ == "__main__":
	def is_task(args, task):
		return (task in args.task or "build" in args.task)

	parser = argparse.ArgumentParser()

	parser.add_argument(
		"task",
		nargs="*",
		default="build",
		choices=["scss", "dotjs", "rjs", "build", "watch"],
	)

	args = parser.parse_args()
	builder = Builder(config)

	if is_task(args, "scss"):
		builder.run_scss()
	if is_task(args, "dotjs"):
		builder.run_dot()
	if is_task(args, "rjs"):
		builder.run_requirejs()
	if is_task(args, "build"):
		builder.build_release()
	if is_task(args, "watch"):
		builder.watch()
