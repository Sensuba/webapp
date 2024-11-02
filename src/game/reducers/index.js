import GameBoard from '../model/board/GameBoard';

export default (state = new GameBoard(), n) => {

  if (n.state) {
    state = n.state;
    state.notify(n.type, n.src, n.data);
  }

  return state;
}
