const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

module.exports.mkDirs = function (dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }
};

module.exports.mp4Files = function (dir) {
    const files = [];
    const temps = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
    for (let i = 0; i < temps.length; i++) {
        const idx = temps[i].indexOf('.mp4');
        if (idx !== -1) {
            files.push(temps[i].substring(0, idx) + '.mp4');
        }
    }
    return files;
};

module.exports.readFileInt = function (file, def) {
    if (fs.existsSync(file)) {
        const data = fs.readFileSync(file, 'utf8') || 0;
        return parseInt(data.trim() || def);
    }
    return def;
};

module.exports.writeFileVal = function (file, val) {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
    fs.writeFileSync(file, val);
};

module.exports.newName = function (id, name) {
    return `${('00000' + id).slice(-5)}_${name.trim()
        .replace(/[\\:\/*?"|]/gim, '_')}`.trim() + '.mp4';
};

module.exports.openVideo = function (conf, data) {
    return function (cb) {
        const src = path.join(conf.dlDir, path.basename(data.mp4));
        const dst = fs.existsSync(src) ? src : path.join(conf.reDir, module.exports.newName(data.id, data.title));
        exec('start ' + dst, function (err, stdout, stderr) {
            if (err) {console.log(err);}
            cb(null, !err);
        });
    }
};