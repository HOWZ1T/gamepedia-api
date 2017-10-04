module.exports.search = function (search_term, page, timeout) //timeout is in seconds elapsed!
{
    return new Promise(function (resolve, reject)
    {
        if (page < 1)
        {
            reject("[GAMEPEDIA-API] Pages can only start at 1 or above!");
        }

        let blacklistURLS = ['http://www.curse.com', 'http://www.facebook.com/CurseNetwork', 'http://www.twitter.com/cursenetwork', 'http://www.youtube.com/curseentertainment',
            'http://www.curse.com/newsletter', 'http://www.curseinc.com/careers', 'http://support.gamepedia.com', 'http://www.curseinc.com/company', 'http://www.curseinc.com/audience',
            'http://www.curse.com/terms', 'http://www.curse.com/privacy']; //These URLS are omitted from the results

        let rawURL = "http://www.gamepedia.com/search?providerIdent=wikis&search=";
        let urlSuffix = "&wikis-page="+page;

        let searchParsed = search_term.replace(' ', '+');
        let URL = rawURL + searchParsed + urlSuffix;

        let request = require('request');
        let cheerio = require('cheerio');
        let Wiki = require('./Wiki').Wiki;

        request(URL, function (err, response, body)
        {
            if (!err)
            {
                let $ = cheerio.load(body);
                let data = $('a');
                let wikis = [];
                data.each((index, element) =>
                {
                    if (element.attribs != null)
                    {
                        if (element.attribs.target != null)
                        {
                            let valid = true;

                            for (let i = 0; i < blacklistURLS.length; i++) //validates the data before entry
                            {
                                if (element.attribs.href == blacklistURLS[i])
                                {
                                    valid = false;
                                    break;
                                }
                            }

                            if (valid == true)
                            {
                                let img = "", summary = "", edits = 0, contributors = 0, articles = 0; //grabs the data that makes up a Wiki entry
                                element.children.forEach(atom =>
                                {
                                    if (atom.name == 'img')
                                    {
                                        img = atom.attribs.src;
                                    }
                                    else if (atom.name == 'summary')
                                    {
                                        summary = atom.children[0].data;
                                    }
                                    else if (atom.name == 'ul')
                                    {
                                        atom.children.forEach(electron =>
                                        {
                                            if (electron.name === 'li')
                                            {
                                                let neutron = electron.children[0].data.split(' ');
                                                if (neutron[1] == 'Edits')
                                                {
                                                    edits = Number(neutron[0].replace(',', ''));
                                                }
                                                else if (neutron[1] == 'Contributors')
                                                {
                                                    contributors = Number(neutron[0].replace(',', ''));
                                                }
                                                else if (neutron[1] == 'Articles')
                                                {
                                                    articles = Number(neutron[0].replace(',', ''));
                                                }
                                            }
                                        });
                                    }
                                });

                                wikis.push(new Wiki(element.attribs.href, img, summary, edits, contributors, articles));
                            }
                        }
                    }
                });

                if (wikis.length == 0)
                {
                    reject("[GAMEPEDIA-API] No wikis found!");
                }
                else
                {
                    resolve(wikis);
                }
            }
            else
            {
                reject("[GAMEPEDIA-API] "+err);
            }
        });

        let seconds = 0;
        let maxSeconds = 10 || timeout;
        setInterval(function ()
        {
            seconds++;

            if (seconds >= maxSeconds)
            {
                reject("[GAMEPEDIA-API] Request timed-out!");
            }
        }, 1000);
    });
}

module.exports.searchPages = function (search_term, pageStart, pageEnd, timeout) //searchs for wikis and gets the results for the pages pageStart(inclusive) to pageEnd(inclusive), timeout is in seconds elapsed!
{
    return new Promise(function (resolve, reject)
    {
        if (pageStart < 1)
        {
            reject("[GAMEPEDIA-API] Pages can only start at 1 or above!");
        }

        if (pageEnd > 100)
        {
            reject("[GAMEPEDIA-API] Pages can only end at 100 or less!");
        }

        if (pageStart > pageEnd)
        {
            reject("[GAMEPEDIA-API] pageStart > pageEnd. Pages can not be searched in descending order!");
        }

        let wikis = [];
        let search = require('./index.js').search;
        let completed = 0;
        let resolveNow = false;
        for (let i = pageStart; i <= pageEnd; i++)
        {
            let page = search(search_term, i);
            page.then(result => { collect(result) }).catch(err => { if (err) { resolveNow = true; } }); //once an empty page is hit it resolves the data immediately
        }

        function collect(data)
        {
            data.forEach((value, index, array) =>
            {
                wikis.push(value);
            });
            completed++;

            if (completed >= pageEnd || resolveNow == true) //once all pages traversed or an empty page is hit, data is resolved.
            {
                resolve(wikis);
            }
        }

        let seconds = 0;
        let maxSeconds = 10 || timeout;
        setInterval(function ()
        {
            seconds++;

            if (seconds >= maxSeconds)
            {
                reject("[GAMEPEDIA-API] Request timed-out!");
            }
        }, 1000);
    });
}