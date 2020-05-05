const express = require('express');
const Board = require('../models/board');
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

      let board = new Board({
        writer: req.body.username,
        contents: ogDatas.description
      });
     
      board.save(err => {
        if (err) throw err;
        return res.json({ success: true });
      });
    });
  }
});


// board 전체 조회
router.get('/', (req, res) => {
  Board.find({}, (err, boards) => {
    child = exec("node ./server/crawler/crawler.js https://www.yna.co.kr/sports/all", function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
          console.log('exec error: ' + error);
      }
    });

      if (err) throw err;
      res.status(200).send(boards);
  });
});

// board 조회
router.get('/:id', (req, res) => {
  Board.findById(req.params.id, (err, board) => {
      if (err) return res.status(500).send("board 조회 실패");
       if (!board) return res.status(404).send("board 없음.");
       res.status(200).send(board);
  });
});
// board 삭제
router.delete('/:id',  (req, res) => {
  Board.findByIdAndRemove(req.params.id, (err, board) => {
      if (err) return res.status(500).send("board 삭제 실패");
      res.status(200).send("board "+ board.writer +" 삭제됨.");
  });
});
// board 수정
router.put('/:id',  (req, res) => {    
  Board.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, board)  => {
      if (err) return res.status(500).send("board 수정 실패.");
      res.status(200).send(board);
  });
});

module.exports = router;
 
