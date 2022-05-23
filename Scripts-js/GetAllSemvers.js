/*
This script is for fetching all the semver ranges of a dependency in package.json in the given path of monorepo.
Pass your repo relative path in <repo_path> & the dependency name in <your_dependency> directly in the script.
Output file will be generated with <repo_name> you pass and the dependency semvers in below format

E.g.:
{"package_name":"@1js/visio-mindmap-fluid-object","dependencies":["^0.59.2001"]}
{"package_name":"@1js/visio-fluid-object","devDependencies":["^0.59.2001"]}

*/


"use strict";
exports.__esModule = true;
var fs = require("fs");
var workspace_tools_1 = require("workspace-tools");
var repos = [
    { name: "<repo_name>", path: "<repo_path>" },
];
// console.log(repos.length);
repos.forEach(function (repo) {
    var allPackageJsons = (0, workspace_tools_1.getAllPackageJsonFiles)(repo.path);
    // Pass your dependency here
    var dep = "<your_dependency>";
    //   console.log("jsons:", allPackageJsons.length);
    for (var _i = 0, allPackageJsons_1 = allPackageJsons; _i < allPackageJsons_1.length; _i++) {
        var file = allPackageJsons_1[_i];
        if (!file.includes('<repo_path>')) {
            break;
        }
        var content = JSON.parse(fs.readFileSync(file, "utf-8"));
        var deps = [];
        var peerDeps = [];
        var devDeps = [];
        if (content["dependencies"] != undefined && content["dependencies"][dep] != undefined)
            deps.push(content["dependencies"][dep]);
        if (content["devDependencies"] != undefined && content["devDependencies"][dep] != undefined)
            devDeps.push(content["devDependencies"][dep]);
        if (content["peerDependencies"] != undefined && content["peerDependencies"][dep] != undefined)
            peerDeps.push(content["peerDependencies"][dep]);
        if (deps.length > 0 || devDeps.length > 0 || peerDeps.length > 0) {
            console.log("Deps counts:", deps.length, devDeps.length, peerDeps.length);
            var pkg = {};
            pkg["package_name"] = content["name"];
            if (deps.length > 0)
                pkg["dependencies"] = deps;
            if (devDeps.length > 0)
                pkg["devDependencies"] = devDeps;
            if (peerDeps.length > 0)
                pkg["peerDependencies"] = peerDeps;
            fs.appendFile(repo.name, JSON.stringify(pkg) + "\n", function (err) {
                if (err) {
                    return console.log("error");
                }
            });
        }
    }
});
