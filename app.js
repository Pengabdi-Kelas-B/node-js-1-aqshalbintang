const fs = require("node:fs");
const path = require("node:path");
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = {}

// Fungsi pembuatan folder
 app.makeFolder = () => {
    rl.question("Masukan Nama Folder Baru : ",(folderName) => {
        fs.mkdir(__dirname + `/${folderName}`,(err) => {
            if (err) {
                console.log("Gagal Membuat Folder Baru : ", err.message);
            } else {
            console.log(`Folder ${folderName} Berhasil Dibuat.`);
        }
        rl.close()
        });
    });
};

// Fungsi pembuatan file
 app.makeFile = () => {
    rl.question("Masukan Nama File Baru (beserta ektensi file) : ",(fileName) => {
        rl.question("Masukkan Isi File Baru : ",(fileContent) => {
            fs.writeFile(path.join(__dirname + `/${fileName}`), fileContent, (err) => {
                if (err) {
                    console.log("Gagal Membuat File Baru : ", err.message);
                } else {
                console.log(`File ${fileName} Berhasil Dibuat.`);
            }
            rl.close();
            });
        });
    });
};

// Fungsi sortir file berdasarkan ekstensi
 app.extSorter = () => {
    const sourceDir = path.join(__dirname, "unorganize_folder");
    const imageDir = path.join(__dirname, "image");
    const textDir = path.join(__dirname, "text");
  
    if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir);
    if (!fs.existsSync(textDir)) fs.mkdirSync(textDir);
  
    fs.readdir(sourceDir, (err, files) => {
      if (err) return console.error("Gagal Membaca Folder : ", err.message);
  
      files.forEach((file) => {
        const ext = path.extname(file).substring(1).toLowerCase();
        const srcPath = path.join(sourceDir, file);
  
        if (["jpg", "png"].includes(ext)) {
          fs.rename(srcPath, path.join(imageDir, file), (err) => {
            if (err) 
                console.log("Gagal Memindahkan File Gambar : ", err.message);
            else 
                console.log(`File ${file} Berhasil Dipindahkan Ke Folder Image.`);
          });
        } else if (["txt", "md"].includes(ext)) {
          fs.rename(srcPath, path.join(textDir, file), (err) => {
            if (err) 
                console.log("Gagal Memindahkan File Teks : ", err.message);
            else 
                console.log(`File ${file} Berhasil Dipindahkan Ke Folder Text`);
          });
        } else {
          console.log(`File ${file} Tidak Dipindahkan Karena Tidak Sesuai Kategori.`);
        }
      });
    });
  };

// Fungsi membaca isi folder
 app.readFolder = () => {
    rl.question("Masukkan Nama Folder : ", (folderName) => {
        const folderPath = path.join(__dirname, folderName);

        fs.readdir(folderPath, (err, files) => {
            if (err) {
                console.log ("Gagal Membaca Folder : ", err.message);
                rl.close();
                return;
            }

            const fileDetails = files.map((file) => {
                const filePath = path.join(folderPath, file);
                const stats = fs.statSync(filePath);
                const extension = path.extname(file).substring(1);
                const fileType = extension === "jpg" || extension === "png" ? "gambar" : "text";

                return {
                    namaFile: file,
                    extensi: extension,
                    jenisFile: fileType,
                    tanggalDibuat: stats.birthtime.toLocaleDateString(),
                    ukuranFile: `${(stats.size / 1024).toFixed(2)} kb`
                };
            });

            console.log(`Berhasil Menampilkan Isi Dari Folder ${folderName} : `);
            console.log(JSON.stringify(fileDetails, null, 4));
            rl.close();
        });
    });
 };

// Fungi membaca isi file
 app.readFile = () => {
    rl.question("Masukkan Nama File (beserta ektensi file) : ", (fileName) => {
        const filePath = path.join(__dirname, fileName);

        if (path.extname(fileName) !== ".txt") {
            console.log("Hanya Dapat Membaca File Teks (.txt)");
            rl.close();
            return;
        }

        fs.readFile(filePath, "utf8", (err,data) => {
            if (err) {
                console.log("Gagal Membaca File : ", err.message);
            } else {
                console.log(`Isi Dari File ${fileName} : \n${data}`);
            }
            rl.close();
        });
    });
 };

module.exports = app