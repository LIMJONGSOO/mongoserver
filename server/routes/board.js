const express = require('express');
const Board = require('../models/board');
const mongoose = require('mongoose');
 
const router = express.Router();
 
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
 
  let board = new Board({
    writer: req.body.username,
    contents: req.body.contents
  });
 
  board.save(err => {
    if (err) throw err;
    return res.json({ success: true });
  });
});


// board 전체 조회
router.get('/', (req, res) => {
  Board.find({}, (err, boards) => {
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
 
