
class Player {
    constructor(name) {
      this.name = name;
    }
  }
  class Popup {
    constructor() {
       
      this.overlay = document.createElement('div');
      this.overlay.className = 'overlay';
      document.body.appendChild(this.overlay);
  
      this.popup = document.createElement('div');
      this.popup.className = 'popup';
      this.overlay.appendChild(this.popup);
   
      this.closeButton = document.createElement('button');
      this.closeButton.textContent = 'Zatvori';
      this.closeButton.addEventListener('click', () => this.closePopup());
      this.popup.appendChild(this.closeButton);
  
      this.input = document.createElement('input');
      this.input.type = 'text';
      this.input.placeholder = 'Unesite ime igrača';
      this.popup.appendChild(this.input);
   
      this.addButton = document.createElement('button');
      this.addButton.textContent = 'Dodaj igrača';
      this.addButton.addEventListener('click', () => this.addPlayer());
      this.popup.appendChild(this.addButton);
   
      this.removeButton = document.createElement('button');
      this.removeButton.textContent = 'Ukloni igrača';
      this.removeButton.addEventListener('click', () => this.removePlayer());
      this.popup.appendChild(this.removeButton);
   
      this.playerList = document.createElement('div');
      document.body.appendChild(this.playerList);
    }
   
    openPopup() {
      this.overlay.style.display = 'flex';
    }
    
    closePopup() {
      this.overlay.style.display = 'none';
    }
   
    addPlayer() {
      const playerName = this.input.value.trim();
      if (playerName !== '') {
        const player = new Player(playerName);
        this.displayPlayer(player);
        this.closePopup();
      }
    }
  
    displayPlayer(player) {
      const playerContainer = document.createElement('div');
      playerContainer.textContent = `Igrač: ${player.name}`;
      this.playerList.appendChild(playerContainer);
    }
   
    removePlayer() {
      const playerContainers = this.playerList.children;
      if (playerContainers.length > 0) {
        this.playerList.removeChild(playerContainers[playerContainers.length - 1]);
      }
    }
  }
  
  const popup = new Popup();
  
  const addButton = document.createElement('button');
  addButton.textContent = 'Dodaj igrača';
  addButton.addEventListener('click', () => popup.openPopup());
  document.body.appendChild(addButton);
  