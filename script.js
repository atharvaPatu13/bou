let highestZ = 10;

class Paper {
    holdingPaper = false;
    prevX = 0;
    prevY = 0;
    curX = 0;
    curY = 0;
    velocityX = 0;
    velocityY = 0;
    curPaperX = 0;
    curPaperY = 0;

    init(paper) {
        // Store original transform
        const originalTransform = paper.style.transform;

        const startDrag = (x, y) => {
            this.holdingPaper = true;
            paper.style.zIndex = highestZ;
            highestZ += 1;

            this.prevX = x;
            this.prevY = y;
        };

        const movePaper = (x, y) => {
            this.curX = x;
            this.curY = y;

            this.velocityX = this.curX - this.prevX;
            this.velocityY = this.curY - this.prevY;

            if (this.holdingPaper) {
                this.curPaperX += this.velocityX;
                this.curPaperY += this.velocityY;

                this.prevX = this.curX;
                this.prevY = this.curY;

                // Get any rotation from the original transform
                let rotation = '';
                if (originalTransform.includes('rotateZ')) {
                    rotation = ' ' + originalTransform.split('rotateZ')[1].split(')')[0] + 'deg)';
                }

                // Apply both translation and original rotation
                paper.style.transform = `translateX(${this.curPaperX}px) translateY(${this.curPaperY}px) rotateZ${rotation}`;
            }
        };

        const endDrag = () => {
            this.holdingPaper = false;
        };

        // Background change on hover
        if (!paper.classList.contains('paper1')) {
            const paperNumber = paper.classList[1]; // Gets 'paper2', 'paper3', etc.

            paper.addEventListener('mouseenter', () => {
                document.body.classList.add(`hover-${paperNumber}`);
            });

            paper.addEventListener('mouseleave', () => {
                document.body.classList.remove(`hover-${paperNumber}`);
            });

            // Touch events for background change
            paper.addEventListener('touchstart', (e) => {
                document.body.classList.add(`hover-${paperNumber}`);
            });

            paper.addEventListener('touchend', () => {
                document.body.classList.remove(`hover-${paperNumber}`);
            });
        }

        // Mouse Events for dragging
        paper.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (e.button === 0) {
                startDrag(e.clientX, e.clientY);
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (this.holdingPaper) {
                movePaper(e.clientX, e.clientY);
            }
        });

        window.addEventListener('mouseup', endDrag);

        // Touch Events for dragging
        paper.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startDrag(touch.clientX, touch.clientY);
        });

        document.addEventListener('touchmove', (e) => {
            if (this.holdingPaper) {
                const touch = e.touches[0];
                movePaper(touch.clientX, touch.clientY);
                e.preventDefault(); // Prevent scrolling while dragging
            }
        });

        window.addEventListener('touchend', endDrag);
    }
}

// Initialize all papers
const main = document.querySelector('.main');
const papers = Array.from(main.querySelectorAll('.paper'));

papers.forEach((paper) => {
    const p = new Paper();
    p.init(paper);
});

// Add new paper with keyboard shortcut
document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.metaKey && e.key === 'a') {
        const newPaper = document.createElement('div');
        newPaper.classList.add('paper');
        main.appendChild(newPaper);
        const p = new Paper();
        p.init(newPaper);
        papers.push(newPaper);
    }
});

const paper1 = document.querySelector('.paper1');
paper1.addEventListener('click', () => {
    window.location.href = 'https://resilient-salamander-2c4111.netlify.app/';
});