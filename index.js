var fs          = require("fs");
var Readable    = require("stream").Readable;
var PluginError = require("plugin-error");
var Vinyl       = require("vinyl");
var _           = require("lodash");
var _s          = require("underscore.string");
var pkg         = JSON.parse(fs.readFileSync("package.json", {encoding: "utf8"}));

module.exports = function(options)
{
    "use strict";

    options = _.defaults(options || {}, {
        path:        "style.css",
        name:        _s.titleize(_s.humanize(pkg.name)),
        description: pkg.description,
        version:     pkg.version,
        uri:         pkg.homepage,
        tags:        pkg.keywords,
        author:      pkg.author.name,
        authorUri:   pkg.author.url,
        license:     pkg.license,
        licenseUri:  null
    });

    if (pkg.title) {
        options.name = _s.titleize(_s.humanize(pkg.title));
    }

    if (!options.path) {
        throw new PluginError("gulp-wpstylecss", "`path` is required.");
    }

    if (!options.name) {
        throw new PluginError("gulp-wpstylecss", "`name` is required.");
    }

    /*
      Theme Name:     <%= options.title %>
      Theme URI:      <%= options.homepage %>
      Author:         <%= options.author.name %>
      Author URI:     <%= options.author.url %>
      Description:    <%= options.description %>
      Version:        <%= options.version %>
      License:        <%= options.license %>
      License URI:    <%= options.licenseUri %>
      Tags:           <%= options.keywords %>
    */
    var contents = "/*\n";

    contents += "Theme Name:     " + options.name + "\n";

    if (options.uri) {
        contents += "Theme URI:      " + options.uri + "\n";
    }

    if (options.author) {
        contents += "Author:         " + options.author + "\n";
    }

    if (options.authorUri) {
        contents += "Author URI:     " + options.authorUri + "\n";
    }

    if (options.description) {
        contents += "Description:    " + options.description + "\n";
    }

    if (options.version) {
        contents += "Version:        " + options.version + "\n";
    }

    if (options.license) {
        contents += "License:        " + options.license + "\n";
    }

    if (options.licenseUri) {
        contents += "License URI:    " + options.licenseUri + "\n";
    }

    if (options.tags) {
        contents += "Tags:           " + options.tags + "\n";
    }

    contents += "*/\n";

    var stream = new Readable({objectMode: true});

    stream.push(new Vinyl({
        path: options.path,
        contents: new Buffer.from(contents, "utf8")
    }));

    stream.push(null);

    return stream;
};
