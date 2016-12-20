//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

class UndoStack {
    constructor() {
        this.states = [];
        this.index = -1;
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
    
    undo(store) {
        if (this.undoable()) {
            this.index--;
            const state = this.states[this.index];
            store.dispatch({type:'setState', state:state});
        }
    }
    
    redo(store) {
        if (this.redoable()) {
            this.index++;
            const state = this.states[this.index];
            store.dispatch({type:'setState', state:state});
        }
    }
}

export default UndoStack;
