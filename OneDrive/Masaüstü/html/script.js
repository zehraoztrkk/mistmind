const maps = [
      [
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,0,1],
        [1,0,1,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,2,1]
      ],
      [
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,0,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,0,1,0,1,0,1],
        [1,0,1,0,1,1,0,1,0,1,0,1],
        [1,0,0,0,0,1,0,0,0,1,0,1],
        [1,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,1,0,0,0,1,0,0,0,1],
        [1,0,0,0,0,1,0,0,0,1,2,1],
        [1,1,1,1,1,1,1,1,1,1,1,1]
      ],
      [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,1,0,0,0,1,0,1],
        [1,0,1,1,1,1,0,1,0,1,0,1,0,1],
        [1,0,0,0,0,0,0,1,0,1,0,1,0,1],
        [1,0,1,1,1,1,1,1,0,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,1,0,1,0,1],
        [1,1,1,1,1,1,1,1,0,1,0,1,2,1],
        [1,0,0,0,0,0,0,1,0,1,0,1,0,1],
        [1,0,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ]
    ];

    let level = 0;
    let map = maps[level];
    let player = { x: 1, y: 1 };
    let gamePaused = false;
    const playerImageSrc = "/cute-axolotl-pack.png"; // Resim dosyası proje klasöründe olmalı

    function render() {
      const game = document.getElementById('game');
      game.innerHTML = '';
      game.style.gridTemplateColumns = `repeat(${map[0].length}, 40px)`;
      game.style.gridTemplateRows = `repeat(${map.length}, 40px)`;

      map.forEach((row, y) => {
        row.forEach((cell, x) => {
          const div = document.createElement('div');
          div.classList.add('cell');

          if (Math.abs(player.x - x) <= 1 && Math.abs(player.y - y) <= 1) {
            if (cell === 1) div.classList.add('wall');
            else if (cell === 2) div.classList.add('exit');
            else div.classList.add('floor');

            if (player.x === x && player.y === y) {
              div.classList.add('player');
              const img = document.createElement('img');
              console.log("Player image source:", playerImageSrc);
              img.src = playerImageSrc;
              img.alt = "Player";
              div.appendChild(img);
            }
          } else {
            div.classList.add('hidden');
          }

          game.appendChild(div);
        });
      });
    }

    function showPopupWithConfetti(message) {
      gamePaused = true;
      const popup = document.getElementById('popup');
      const canvas = document.getElementById('confetti-canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      popup.textContent = message;
      popup.style.display = 'block';
      canvas.style.display = 'block';

      const confettis = [];
      const colors = ['#f94144', '#f3722c', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];

      for(let i=0; i<150; i++) {
        confettis.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          r: Math.random() * 6 + 4,
          d: Math.random() * 10 + 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          tilt: Math.random() * 10 - 10,
          tiltAngle: 0,
          tiltAngleIncrement: (Math.random() * 0.1) + 0.05
        });
      }

      function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettis.forEach(c => {
          ctx.beginPath();
          ctx.lineWidth = c.r / 2;
          ctx.strokeStyle = c.color;
          ctx.moveTo(c.x + c.tilt + c.r / 2, c.y);
          ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 2);
          ctx.stroke();
        });
      }

      function updateConfetti() {
        confettis.forEach(c => {
          c.tiltAngle += c.tiltAngleIncrement;
          c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
          c.x += Math.sin(c.d);
          c.tilt = Math.sin(c.tiltAngle) * 15;

          if (c.y > canvas.height) {
            c.x = Math.random() * canvas.width;
            c.y = -20;
            c.tilt = Math.random() * 10 - 10;
          }
        });
      }

      let animationId;

      function animate() {
        drawConfetti();
        updateConfetti();
        animationId = requestAnimationFrame(animate);
      }

      animate();

      setTimeout(() => {
        popup.style.display = 'none';
        canvas.style.display = 'none';
        cancelAnimationFrame(animationId);
        gamePaused = false;
      }, 4000);
    }

    function nextLevel() {
      level++;
      if(level >= maps.length) {
        showPopupWithConfetti("Congratulations! You completed all levels! 🎉");
        setTimeout(() => {
          level = 0;
          map = maps[level];
          player = { x: 1, y: 1 };
          render();
        }, 4000);
      } else {
        showPopupWithConfetti("You Made It! Next Level! 🎉");
        map = maps[level];
        player = { x: 1, y: 1 };
        render();
      }
    }

    document.getElementById('start-button').addEventListener('click', () => {
      document.getElementById('start-screen').style.display = 'none';
      const game = document.getElementById('game');
      game.style.display = 'grid';
      render();
    });

    document.addEventListener('keydown', e => {
      if(gamePaused) return;

      const dx = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: 0, ArrowDown: 0 };
      const dy = { ArrowLeft: 0, ArrowRight: 0, ArrowUp: -1, ArrowDown: 1 };
      if (dx[e.key] !== undefined) {
        const newX = player.x + dx[e.key];
        const newY = player.y + dy[e.key];
        if (map[newY][newX] !== 1) {
          player.x = newX;
          player.y = newY;
          if (map[newY][newX] === 2) {
            nextLevel();
          }
        }
        render();
      }
    });