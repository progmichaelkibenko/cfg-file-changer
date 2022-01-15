const fs = require("fs");
const Iconv = require("iconv").Iconv;

const { config } = require("./config");

function decode({ fileBuffer, from, to }) {
  var iconv = new Iconv(from, to);
  var buffer = iconv.convert(fileBuffer);
  return buffer.toString("utf8");
}

function encode({ content, from, to }) {
  const originalBuffer = Buffer.from(content, "utf-8");
  const iconv = new Iconv(from, to);
  const buffer = iconv.convert(originalBuffer);
  return buffer;
}

const writeFile = ({ filePath, content }) => {
  fs.writeFileSync(filePath, content);
};

const renameFile = ({ oldPath, newPath }) => {
  fs.renameSync(oldPath, newPath);
};

const rewriteFile = ({ folderPath, model }) => {
  const { filePath, findText, replaceTo, resultFilePath, prevFilePath } = model;
  try {
    const originalFilePath = `${folderPath}/${filePath}`;
    const fileBuffer = fs.readFileSync(originalFilePath);
    const originalFormattedData = decode({
      fileBuffer,
      from: "CP1255",
      to: "UTF-8//TRANSLIT//IGNORE",
    });
    const newFormattedData = originalFormattedData.replace(findText, replaceTo);

    if (resultFilePath === prevFilePath) {
      throw new Error("The result file path cant be equal to prevFilePath");
    }

    // save the old file
    const oldFileWritablePath = `${folderPath}/${prevFilePath}`;
    renameFile({ oldPath: originalFilePath, newPath: oldFileWritablePath });

    // save the new file
    const newFileWritablePath = `${folderPath}/${resultFilePath}`;
    writeFile({
      filePath: newFileWritablePath,
      content: encode({
        content: newFormattedData,
        from: "UTF-8//TRANSLIT//IGNORE",
        to: "CP1255",
      }),
    });
    console.log(`${filePath} Done =))`);
  } catch (err) {
    console.log(`Failed to make rewrite of ${filePath} =((`);
  }
};

const isFolder = (path) => fs.statSync(path).isDirectory();

const start = () => {
  const { folderPath, ignoreFolders, model } = config;

  const files = fs.readdirSync(folderPath);

  for (file of files) {
    const path = `${folderPath}/${file}`;
    if (isFolder(path)) {
      rewriteFile({ folderPath: path, model });
    }
  }
};

start();
