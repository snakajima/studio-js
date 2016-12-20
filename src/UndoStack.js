
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
        console.log("undo:append:" + this.states.length + "," + this.index)
    }
    
    undo() {
        if (this.undoable()) {
            this.index--;
            const state = this.states[this.index];
            this.store.dispatch({type:'setState', state:state});
            console.log("undo:undo:" + this.states.length + "," + this.index)
        }
    }
    
    redo() {
        if (this.redoable()) {
            this.index++;
            const state = this.states[this.index];
            this.store.dispatch({type:'setState', state:state});
            console.log("undo:redo:" + this.states.length + "," + this.index)
        }
    }
}

export default UndoStack;
