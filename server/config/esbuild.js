const { build } = require("esbuild");

build({
  entryPoints: ["index.js"],
  minify: true,
  platform: "node",
  bundle: true,
  outfile: "dist/build.js",
})
  .then(() => console.log("Build Complete!🎉"))
  .catch(() => {
    console.error("Build failed 😿");
    process.exit(1);
  });
