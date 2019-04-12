const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.blocks = [];
        this.initGenesisBlock();
        this.getBlockByIndex();
        this.postNewBlock();
        this.getTheBlockchain();
    }

    initGenesisBlock(){
        if(this.blocks.length===0){
            let newBlock = new BlockClass.Block("First block in the chain - Genesis block");
                newBlock.height = 0;
                newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                newBlock.previousBlockHash = "0x";
                this.blocks.push(newBlock);
        }

    }
    
      // for testing purposes :)
     getTheBlockchain(){
        this.app.get("/blocks", (req, res) => {
            // return the whole blockchain
            res.send(this.blocks);
        });
     }
   
     // Implement a GET Endpoint to retrieve a block by index, url: "/block/:index"
     // Working perfectly 
     getBlockByIndex() {
        this.app.get("/block/:index", (req, res) => {
            // returns any block if its in the blockchain height  
            res.send(this.blocks[req.params.index]);
        });
    }

    
    // Implement a POST Endpoint to add a new Block, url: "/block"
    // checks if the request has "body" then adds it to the blockchain 
    postNewBlock() {
        this.app.post("/block", (req, res) => {
            if(req.body.body == null){
                res.send("can't send an empty block")
            }else{
            let newBlock = new BlockClass.Block(req.body.body);
                newBlock.height = this.blocks.length;
                newBlock.previousBlockHash = this.blocks[this.blocks.length-1].hash;
                newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                this.blocks.push(newBlock);
                res.json(newBlock);
            }
        });
    }

   

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}