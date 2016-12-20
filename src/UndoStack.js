//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

class UndoStack {
    constructor() {
        this.states = [];
        this.index = -1;
    }
    
    setStore(store) {
        this.store = store;
    }
    
    undoable() {
        return this.index > 0;
    }
    
    redoable() {
        return this.index+1 < this.states.length;
    }
    
    append(state) {
        this.states = this.states.slice(0,this.index+1);
        this.states.push(state);
        this.index++;
    }
    
    undo() {
        if (this.undoable()) {
            this.index--;
            const state = this.states[this.index];
            this.store.dispatch({type:'setState', state:state});
        }
    }
    
    redo() {
        if (this.redoable()) {
            this.index++;
            const state = this.states[this.index];
            this.store.dispatch({type:'setState', state:state});
        }
    }
}

export default UndoStack;
