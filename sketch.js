//array goods
var kebabs = [];
//array avversari
var buste = [];
//contatore kebab
var score = 0;
//variabile per schermate di gioco
var gameOver = false;
//dimensione iniziale sprites
var spriteSize = 80;

function preload() {
    //caricamento immagini
    alive = loadImage('assets/Chiara.png');
    busta = loadImage('assets/Busta.png');
    keb = loadImage('assets/kebab.png');
    dead = loadImage('assets/ChiaraDead.png');
    cooper = loadFont('assets/COOPBL.TTF');

}

function setup() {
    frameRate(30);
    createCanvas(windowWidth, windowHeight);
    //caricamento array goods
    for (var i = 0; i < 30; i++) {
        kebabs[i] = new Kebab(random(width * 0.1, width * 0.9), random(height * 0.1, height * 0.9));
    }
    //caricamento array avversari
    for (var i = 0; i < 3; i++) {
        buste[i] = new Busta();
    }
    //creazione avatar
    chiaretta = new Chiara();

}

function draw() {
    //background sempre visibile
    background('rgb(110, 232, 160)');
    //avatar sempre in movimento
    chiaretta.update();

    if (gameOver == true) {
        //avatar morto
        chiaretta.show(dead);
        //schermata di perdita
        fill(0);
        textSize(50);
        textFont(cooper);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text('FLOP!', width / 4, height / 2 - 50, width / 2);
        text('Busta ti ha raggiunto!', width / 4, height / 2, width / 2);


    } else if (score < 30) {
        //avatar vivo
        chiaretta.show(alive);

        for (var i = 0; i < buste.length; i++) {
            //aggiorno posizione avversari
            buste[i].update();
            //visualizzazione avversari
            buste[i].show();
            //se avversari e user si sovrappongono
            if (buste[i].eats(chiaretta)) {
                gameOver = true;
            }
        }

        for (var i = kebabs.length - 1; i >= 0; i--) {
            kebabs[i].show();
            //se goods e user si sovrappongono
            if (chiaretta.eats(kebabs[i])) {
                //goods viene rimosso
                kebabs.splice(i, 1);
                //incremento punteggio
                score++;
            }
        }

        //punteggio
        fill(0);
        textSize(20);
        textFont('Cooper Black');
        textStyle(BOLD);
        textAlign(LEFT, CENTER);
        var t = "I kebab mangiati sono: " + score;
        text('Fai mangiare a Chiarona Dalessandro tutti i kebab prima che Busta Di Piscio riesca a catturarti.', height / 15, height / 15)
        text(t, height / 15, height / 15 + 20);


    } else {
        //schermata di vittoria
        chiaretta.show(alive);
        fill(0);
        textSize(50);
        textFont('Cooper Black');
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text('TOP!', width / 4, height / 2 - 50, width / 2);
        text('Hai mangiato tutti i kebab!', width / 4, height / 2, width / 2);
    }
}

function Kebab(x, y) {
    var kebWidth = 25;
    var kebHeight = 60

    this.pos = createVector(x, y);

    this.show = function() {
        //centratura dell'img
        image(keb, this.pos.x - (kebWidth / 2), this.pos.y - (kebHeight / 2), kebWidth, kebHeight);
    }
}

function Chiara() {
    //posizione che traccia il mouse
    this.pos = createVector(mouseX, mouseY);
    //dimensione variabile
    this.size = spriteSize;

    this.show = function(avatar) {
        image(avatar, this.pos.x - (this.size / 2), this.pos.y - (this.size / 2), this.size, this.size);
    }

    this.update = function() {
        this.pos = createVector(pmouseX, pmouseY);
    }

    this.eats = function(keb) {
        //calcolo distanza centro della bolla - punto interessato
        var d = p5.Vector.dist(this.pos, keb.pos)
        //se distanza minore della somma dei raggi
        if (d < (25 + this.size / 2)) {
            //avatar ingrassa
            this.size += 3;
            //conferma di sovrapposizione
            return true;
        } else return false;

    }
}

function Busta() {
    //posizione randomica
    this.pos = createVector(random(width / 2, width), random(height / 2, height));

    this.update = function() {
        //velocità viene incrementata in base al punteggio
        this.speed = score + 1;
        //vincolo massimo velocità
        constrain(this.speed, 1, 9);
        //calcolo direzione
        var vel = createVector(mouseX, mouseY);
        vel.sub(this.pos);
        vel.setMag(1);
        this.pos.add(vel.mult(this.speed));
    }

    this.show = function() {
        image(busta, this.pos.x - (spriteSize / 2), this.pos.y - (spriteSize / 2), spriteSize, spriteSize);
    }

    this.eats = function(keb) {
        //calcolo distanza
        var d = p5.Vector.dist(this.pos, keb.pos)
        //conferma o smentita di sovrapposizione
        if (d < (keb.size + spriteSize) / 2) {
            return true;
            //console.log('KEBABB');
        } else return false;
    }
}
