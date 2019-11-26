const fs = require('fs');
const slugify = require('slugify');
const puppeteer = require('puppeteer');



(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = 'https://afk-arena.fandom.com/';
    await page.goto(url+'wiki/Heroes', { waitUntil: 'networkidle2' });
    
    await page.setViewport({ width: 1920, height: 1070 });
    await page.screenshot({path: './afk/'+'afk-wiki'+'.png', fullPage: true});
    console.log("Vamos a empezar")
    // let tablas = await page.evaluate(() => {
    //     console.log("Estoy esperando")
    //     const tablas = document.querySelectorAll('table.wikitable');
    //     let i = 0;
    //     tablas.forEach(tabla => {
    //         console.log('Holi '+i);
    //         i++
    //     });
    //     return 'Things!';
    // });
    let tablas = await page.$$eval('table.wikitable tr', async (tablas) => {
        let things = [];
        tablas.forEach( async (tabla) => {
            let rarity = tabla.querySelector('td > b > span').innerText;
            let name = tabla.querySelector('td > a[title]').innerText;
            let link = tabla.querySelector('td > a[title]').getAttribute('href');
            let img = tabla.querySelector('td > a > img').getAttribute('data-src');
            let imgName = tabla.querySelector('td > a > img').getAttribute('data-image-name');
            things.push({'nombre': name, 'rareza': rarity, 'link': link, 'imagen': img, 'imgName': imgName});
        });
        return things;
    });

    for (const tabla of tablas) {
        console.log('Empiezo con ' + tabla.nombre);
        
        let name = tabla.link.split('/');
        name = name[2];
        name = slugify(name);
        //console.log(name);
        
        let dir = './afk/' + name + '/';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        var viewSource = await page.goto(tabla.imagen);
        await fs.writeFileSync(dir+tabla.imgName, await viewSource.buffer());

        var jsonContent = JSON.stringify(tabla);
        //console.log(jsonContent);
        await fs.writeFileSync(dir + name +'.json', jsonContent, 'utf8');

        console.log(url + tabla.link);

        await page.goto(url+tabla.link);
        let imagenes = await page.$$eval('div.WikiaArticle#WikiaArticle img', async (imgs) => {
            let downloads = [];
            imgs.forEach( async (img) => {
                let sorce = img.getAttribute('data-src');
                if (sorce === null) {
                    sorce = img.getAttribute('srcset');
                    sorce = sorce.split('.png');
                    sorce = sorce[0]+'.png';
                }
                let imgName = img.getAttribute('data-image-name');
                downloads.push({'sorce': sorce, 'imgName': imgName});
            });
            return downloads;
        });
        // console.log(imagenes);
        
        for (const img of imagenes) {
            console.log(img.sorce);
            // console.log(dir+img.imgName);
            // console.log('----');
            if (img.sorce !== null) {
                var viewSource = await page.goto(img.sorce);
                await fs.writeFileSync(dir + slugify(img.imgName), await viewSource.buffer());
            }
        }
        console.log('Termine con ' + tabla.nombre);
        console.log('--- o ---');
        
    }
    console.log('---< o >---');
    console.log('---< o >---');
    console.log('Done!');
    await browser.close();
})();