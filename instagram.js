const rp = require('request-promise');
const cheerio = require('cheerio');
const axios = require('axios').default;
const express = require('express');
var bodyParser = require('body-parser')
const path = require('path');
var cors = require('cors');
const { json } = require('body-parser');
const nodemailer = require("nodemailer");
const cron = require('node-cron');
const { url } = require('inspector');
const port = process.env.PORT || 3000;
var client_id="7e0bf25e915d0105c23f35d8566851089eb6b52248fa";
var maxHashtags ="20";
var hashtagPosition = "auto";
const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));


var arrayofhashtags = [
    {text:"love",value:"#love #loveyourself #loveit #lovely #instalove #mathiaslovedogs #naturelovers #lovequotes #loveher #selflove #lovehim #lovestory #lovers #inlove #loved  "},
    {text:"instagram",value:"#instagram #instagramhub #reelsinstagram #instagramreels #artistsoninstagram #instagrammers #instagrammer #bikersofinstagram #instagramreel #instagramartist #instagramvideo #instagramnails #instagramtags"},
    {text:"instagood",value:"#instagood #instagoodmyphoto #instagoods #watchthisinstagood #featuremeinstagood #2instagood #instagood10k #2instagoodportraitlove #ınstagood"},
    {text:"link",value:"#link #linkinbio #blink #eternalink"},
    {text:"follow",value:"#follow #follow4follow #followme #followforfollowback #followforfollow #followback #likeforfollow #followers #following #followｍe #like4follow #follow4like #followalways #followmeplease"},
    {text:"photography",value:"#photography #naturephotography #travelphotography #streetphotography #photographylovers #portraitphotography #canonphotography #mobilephotography #fashionphotography #nikonphotography #photographyislife #photographysouls #photography📷"},
    {text:"instadaily",value:"#instadailyphotos #instadailypost❤️ #instadailys #instadailypics #instadailyreels #instadailyphotography #instadaily❤️ #instadailyvideo #instadailyy #instadailyart #instadailyquote #instadailyphotos💞💞💞 #instadailypost❤️💋😍☀️📸🆒👫 "},
    {text:"linkforlike",value:"#likeforlikes #likeforlike #likeforfollow #likesforlikes #likesforlike #tagsforlikes #likeforlikeback #likeforlikealways #likesforfollow #followforlike #likesforlikesback #tagsforlikesapp #likeforfollowers #likeforliketeam  "},
    {text:"picoftheday",value:"#picoftheday📷❤️ #picofthedayy #travelpicoftheday #ig_picoftheday #picofthedayindia #mypicoftheday #rdcpicoftheday #gopropicoftheday #picoftheday❤ #picoftheday😍 #topicoftheday #picoftheday😎 #iphonepicoftheday #picofthedayoo #picoftheday📸❤️ #instapicoftheday😇  "},
    {text:"instamood",value:"#instamood #instamood😍 #instamood❤️ #instamoode #instamood😎 #instamood_wall #instamoodstyle #instamoodi #instamood❤ #instamood😍✌️ #instamood😊 #instamoodweekend "},
    {text:"igers",value:"#igers #igersitalia #igersjp #igersoftheday #igersfrance #igerskenya #igersholland #igerssuisse #igers413 #igersterni #igersdordogne #igersuisse "},
    {text:"lifeisgood",value:"#lifeisgood #goodlife #istagood #lifesgood #isthisreallife #istangood #lifegood #goodfoodgoodlife #isntagood #isolife #lifeissogood #lifeinparis #ismellgood #isgood #istantgood "},
    {text:"nature",value:"#nature #naturephotography #naturelovers #naturelover #natureza #nature_perfection #naturephoto #nature_brilliance #natureheals #natureatitsbest #nature_up_close #natureshooters #nature_greece #naturel_shots #naturehippies #natureaddicted "},
    {text:"bestoftheday",value:" #bestoftheday #day #thebestoftheday #bestofthedays #bestofthedayphoto #bestest_of_the_day #photooftheday #instadaily #picoftheday #goodpic"},
    {text:"sunset",value:"#sunset #sun #sunrisesunset #photography #photographer #colors #capture #nature #photoshoot #followme #sunrise #photooftheday #photojournalism #sunbursts #sun # "},
    {text:"smile",value:"#smile #happy #happiness #love #smilemore #behappy #smiles #smilepost #smilealways #smiletoomuch #smileback #smileanychanceyouget #cute #happy "},
    {text:"selfie",value:"#selfie #selfieculture #selfiedaily #selfiestick #selfiegame #selfiemood #selfiedays #selfiemaxx #selfiesunday #selfiesunday #selfieeveryday #selfie "},
    {text:"family",value:"#family #familytime #familyfun #familyfunny #familyphoto #familyphotography #familylove #familylife #familyvacation #familytravel #familyadventure #familypic #familylovers #familyunit #familyfunny #familygoals #familyphotodays #familylove # "},
    {text:"attitude",value:"#attitude #attitudequotes #attitudeiseverything #perspective #positivevibes #positive #happiness #happinessquotes #happinessislove #happinessis #happinessisme #happinessiseverything #happinessisaboss #lifestyle #quotes "},
    {text:"black",value:"#blackandwhite #blackandwhitephotography #blackandwhiteisbest #blackandwhiteonly #blackandwhitephoto #blackandwhitephotographyislife #blackandwhitephotochallenge #blackandwhitephotographer #blackandwhitepict "},
    {text:"vibes",value:"#vibes #vibesquad #vibesaregood #vibesarealive #vibesarehigh #vibesarefreakinggood #vibesonly #vibesarehigh #vibesarestrong #vibesaregood #vibesare "},
    {text:"nofilter",value:"#nofilter #nofilterneeded #nofilterneededever #nofilterneedednever #nofilterneeded #nofilterneededhere #nofilter #nofiltersneeded #nofilterneeded #nofilterneededforthisone "},
    {text:"tbt",value:"#tbt #throwbackthursday #tbtlove #tbtpic #tbtpicoftheday #tbtphoto #tbtphotooftheday #tbtphoto #tbt #throwback #throwbackthursday #thursday #thursdaypic #thursdaypic #thurs "},
    {text:"swag",value:"#swag #swagger #swaggy #swagg #swaggie #swaggerjagger #swagbucks #instaswag #selfie #selfiegame #selfieoftheday #selfieoftheyear #selfieformula #selfiecentral #selfie #self "},
    {text:"food",value:"#foodporn #foodie #foodiegram #foodpics #foodgasm #photooftheday #instafood #food #foodgasm #foodlover #foodstagram #foodiegram #instagood #foodiesofinstagram #foodstagram #foodgasm "},
    {text:"hungry",value:"#hungry #hungr #hungryaf #hungryaf #food #foodporn #foodie #foodgasm #foodstagram #foodiegram #foodblogger #foodblog #foodblogger_de #instafood #foodies #foodshare #foodshareindia # "},
    {text:"travel",value:"#traveller #travelling #traveller #travellife #travelgram #travelblogger #travelblog #travelblogger #instatravel #travelgram #instago #beautifuldestinations #travelingram #travelphotography #traveling #igtravel #igtravel "},
    {text:"vacation",value:"#vacation #travel #traveler #travelphotography #travelblogger #vacationmode #happiness #instagram #holiday #summer #sun #beach #sea #sky #clouds #view #nature #paradise #relax #relaxing #sunset # "},
]

app.post("/hashtag",async function(req,res) {
    let hashtag = req.body.hashtag;
    var post = hashtag.toLowerCase();
  console.log(hashtag);
  console.log(arrayofhashtags);
    let index = arrayofhashtags.findIndex((obj) => obj.text == post);
    console.log(index); 
    if(index >= 0){
        res.send(arrayofhashtags[index].value);
    }else{
        res.send(arrayofhashtags[Math.floor(Math.random()*arrayofhashtags.length)].value)
    }
    
    /*
    axios.get("https://api.ritekit.com/v1/stats/auto-hashtag", {
        params: {
            client_id: client_id,
            post:post,
            maxHashtags:maxHashtags,
            hashtagPosition:hashtagPosition
        }
      }).then((response)=>{
      if (response.status >= 400) {
          console.log(response.status);
          throw new Error("Bad response from server");
      } else{
        console.log(response.data);
        console.log(response.data.post);
          console.log("kya aaya");
          res.send(response.data.post);
      }
    }).then((data)=>{
      console.log(data);
      console.log("data");
    }).catch((err) =>{
        console.log(err);
    })

*/

});
app.post('/uploadhashtag',function(req,res){
    let hashtag = req.body.hashtag;
    var list = req.body.list;
    arrayofhashtags.push({text:hashtag,value:list});
    console.log(arrayofhashtags);
    res.end("ok");
});
app.get('/getpopular',function(req,res){
res.json(returnpopular());
});
 

function returnpopular(){
    var popular =[
        {name:"#photooftheday",count:Math.floor(Math.random()*1000000)},
        
        {name:"#instagood",count:Math.floor(Math.random()*1000000)},
        
        {name:"#nofilter",count:Math.floor(Math.random()*1000000)},
        
        {name:"#tbt",count:Math.floor(Math.random()*1000000)},
        
       {name: "#igers",count:Math.floor(Math.random()*1000000)},
        
        {name:"#picoftheday",count:Math.floor(Math.random()*1000000)},
        
        {name:"#love",count:Math.floor(Math.random()*1000000)},
        
        {name:"#nature",count:Math.floor(Math.random()*1000000)},
        
        {name:"#swag",count:Math.floor(Math.random()*1000000)},
        
        {name:"#lifeisgood",count:Math.floor(Math.random()*1000000)},
        
        {name:"#caseofthemondays",count:Math.floor(Math.random()*1000000)},
        
       {name:"#instapic",count:Math.floor(Math.random()*1000000)},
        
        {name:"#instadaily",count:Math.floor(Math.random()*1000000)},
        
        {name:"#selfie",count:Math.floor(Math.random()*1000000)},
        
        {name:"#instamood",count:Math.floor(Math.random()*1000000)},
        
        {name:"#bestoftheday",count:Math.floor(Math.random()*1000000)},
        {name:"#fun",count:Math.floor(Math.random()*1000000)},
        {name:"#beauty",count:Math.floor(Math.random()*1000000)},
        {name:"#smile",count:Math.floor(Math.random()*1000000)},
        {name:"#family",count:Math.floor(Math.random()*1000000)},
        {name:"#makeup",count:Math.floor(Math.random()*1000000)},
        {name:"#sunset",count:Math.floor(Math.random()*1000000)},
        {name:"#motivation",count:Math.floor(Math.random()*1000000)},
        {name:"#friends",count:Math.floor(Math.random()*1000000)}
        ]
        return popular.sort((a,b) => b.count-a.count).slice(0,10)
   // return popular;    
}
async function scrape(url){
    return new Promise((resolve,reject) =>{
  
    rp(url)
   .then(async (html) => {       
     let hashtags = await scrapeHashtags(html);

        console.log(hashtags);
        console.log("*");
        hashtags = await removeDuplicates(hashtags);
        hashtags = hashtags.map(ele => "#" + ele);
        let newarr =[];
for(let i =0;i<20;i++){
    newarr.push(hashtags[i]);
}
        console.log(newarr.toString());
         resolve(newarr.toString());

         
    })
    .catch((err) => {
        console.log(err);
    });
})

}
 
const scrapeHashtags = (html) => {  
    return new Promise((resolve,reject) =>{
        var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
        var matches = [];
        var match;
     
        while ((match = regex.exec(html))) {
            matches.push(match[1]);
        }
     
        resolve(matches);
    })
  
}
 
const removeDuplicates = (arr) => {
    return new Promise((resolve,reject) =>{
        let newArr = [];
        arr.map(ele => {
            if (newArr.indexOf(ele) == -1){
                newArr.push(ele)
            }
        })
        resolve(newArr);
    })

}


app.listen(port);