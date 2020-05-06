const express = require('express');
const BookMark = require('../models/bookmark');
const mongoose = require('mongoose');
 
const router = express.Router();

var exec = require('child_process').exec;
var child;

router.post('/', (req, res) => {
  if (req.body.username === "") {
    return res.status(400).json({
      error: "EMPTY USERNAME",
      code: 2
    });
  }
 
  if (req.body.contents === "") {
    return res.status(400).json({
      error: "EMPTY CONTENTS",
      code: 2
    });
  }

  const ogDatas = {
    title : '',
    description: '',
    image: ''
  };

  if (req.body.url) {
    const command = "node ./server/crawler/crawler.js "+req.body.url;
    child = exec(command, function (error, stdout, stderr) {
      stdout.split('<og>').forEach((ogData) => {
        if(ogData.indexOf('title:') != -1) {
          ogDatas.title = ogData.replace('title:','');
        } else if(ogData.indexOf('description:') != -1) {
          ogDatas.description = ogData.replace('description:','');
        } else if(ogData.indexOf('image:') != -1) {
          ogDatas.image = ogData.replace('image:','');
        }
      });
      if (error !== null) {
          console.log('exec error: ' + error);
      }

      let bookMark = new BookMark({
        type: req.body.type,
        name : req.body.name,
        upperDirectory: req.body.directory,
        url : req.body.url,
        og_title : ogDatas.title,
        og_description : ogDatas.description,
        og_image : ogDatas.image,
      });
     
      bookMark.save(err => {
        if (err) throw err;
        return res.json({ success: true });
      });
    });
  } else {
    let bookMark = new BookMakr({
      type: req.body.type,
      name : req.body.name,
      upperDirectory: req.body.directory,
      url : req.body.url,
      og_title : '',
      og_description : '',
      og_image : '',
    });
   
    bookMark.save(err => {
      if (err) throw err;
      return res.json({ success: true });
    });
  }
});


// bookmark 전체 조회
router.get('/', (req, res) => {
  BookMark.find({}, (err, bookmarks) => {
    if (err) throw err;
    res.status(200).send(bookmarks);
});
});

// bookmark 조회
router.get('/:id', (req, res) => {
  BookMark.findById(req.params.id, (err, bookmark) => {
    if (err) return res.status(500).send("bookmark 조회 실패");
    if (!bookmark) return res.status(404).send("bookmark 없음.");
    res.status(200).send(bookmark);
  });
});
// bookmark 삭제
router.delete('/:id',  (req, res) => {
  BookMark.findByIdAndRemove(req.params.id, (err, bookmark) => {
    if (err) return res.status(500).send("bookmark 삭제 실패");
    res.status(200).send("bookmark "+ bookmark.name +" 삭제됨.");
  });
});
// bookmark 수정
router.put('/:id',  (req, res) => {    
  BookMark.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, bookmark)  => {
    if (err) return res.status(500).send("bookmark 수정 실패.");
    res.status(200).send(bookmark);
  });
});

module.exports = router;
 
