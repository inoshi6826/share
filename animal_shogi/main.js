// TODO
// @棋譜
// @完全初期化
// @千日手

let pieceBoard = []; //盤上の駒のID
let pieceBlackCapture = []; //先手の駒台の駒ID
let pieceWhiteCapture = []; //後手の駒台の駒Id

let selectedFlgB = false; //trueで盤上の駒が選択された状態
let selectedFlgC = false; //trueで持ち駒が選択された状態
let addrActiveFlg = false; // 移動位置が出ている場合
let movedFlg = false; // 移動してる場合にtrue
let battleFlg = false; // 駒が取られた場合にtrue
let promoteFlg = false; // 駒が成ったときにtrue

let selectedDan; //駒を選択するときクリックしたマスの段
let selectedSuji; //駒を選択するときクリックしたマスの筋

let selectedKoma; //選択された駒
let teban; //手番 trueが先手

let board = []; // 作ったが使ってない
let capture = []; // 作ったが使ってない
let slb; //先手用のセレクトした駒を格納する変数
let slw; //後手用のセレクトした駒を格納する変数

let komaAddr = {
  dan: 0,
  suji: 0,
};
let selectedElm = ""; // エレメントを一時的に入れる
let CheckMate;
//駒にID割り振り
const EMPTY = 0;
const FU = 1;
const KAKU = 2;
const HI = 3;
const OU = 4;
const KIN = 5; //ひよこのなりごま
const ENEMY = 6;
const E_FU = FU + ENEMY; // 7
const E_KAKU = KAKU + ENEMY; // 8
const E_HI = HI + ENEMY; // 9
const E_OU = OU + ENEMY; // 10
const E_KIN = KIN + ENEMY; // 11 ひよこのなりごま

// ! kif情報を一時的に入れる
let memory = {
  index: 0,
  koma: EMPTY,
  from: { dan: 0, suji: 0 },
  to: { dan: 0, suji: 0 },
  think_time: "(00:00/00:00:00)",
};

const AddrId = function (dan, suji) {
  // danと筋が入力されている場合
  try {
    const addr_id = "s" + suji + "dan" + dan;
    return addr_id;
  } catch {
    console.error("addr ID was not available");
    return null;
  }
};

const isBlackKoma = function (koma) {
  return FU <= koma && koma <= KIN;
};

const isWhiteKoma = function (koma) {
  return E_FU <= koma && koma <= E_KIN;
};

const isKoma = function (koma) {
  return (FU <= koma && koma <= KIN) || (E_FU <= koma && koma <= E_KIN);
};

const ReturnKomaName = function (koma) {
  if (koma == FU || koma == E_FU) {
    return "歩";
  } else if (koma == KAKU || koma == E_KAKU) {
    return "角";
  } else if (koma == HI || koma == E_HI) {
    return "飛";
  } else if (koma == OU || koma == E_OU) {
    return "王";
  } else if (koma == KIN || koma == E_KIN) {
    return "金";
  } else {
    console.error("駒ではありません");
    return null;
  }
};

const ReturnKifAddr = function (dan, suji) {
  dan = +dan;
  suji = +suji;
  const dan_ls = ["１", "２", "３"];
  const suji_ls = ["一", "二", "三", "四"];
  let d = 0;
  let s = 0;
  for (i = 0; i <= 2; i++) {
    for (j = 0; j <= 3; j++) {
      if (dan == i + 1) {
        d = dan_ls[i];
      }
      if (suji == j + 1) {
        s = suji_ls[j];
      }
    }
  }
  const addr = d + s;
  return addr;
};

// 歩の場合のみ必要
const isBlackTerritory = function () {
  const ls = ["s4dan3", "s4dan2", "s4dan1"];
  // 駒台から使う場合
  if (selectedFlgC && selectedKoma == FU) {
    if (selectedSuji == 4 && 1 <= selectedDan && selectedDan <= 3) return true;
    else {
      return false;
    }
  } else {
    // 盤上から使う場合
    const addr = document.getElementsByClassName("moveable-place");
    if (selectedKoma == FU && ls.includes(addr[0].id) && selectedSuji == 4) {
      return isValidAddr(selectedDan, selectedSuji);
    } else {
      return false;
    }
  }
};
// 後手の場合
const isWhiteTerritory = function () {
  const ls = ["s1dan3", "s1dan2", "s1dan1"];
  // 駒台から使う場合
  if (selectedFlgC && selectedKoma == E_FU) {
    if (selectedSuji == 1 && 1 <= selectedDan && selectedDan <= 3) {
      return true;
    } else {
      return false;
    }
  }
  // 盤上から使う場合
  else {
    const addr = document.getElementsByClassName("moveable-place");
    if (selectedKoma == E_FU && ls.includes(addr[0].id) && selectedSuji == 1) {
      return isValidAddr(selectedDan, selectedSuji);
    } else return false;
  }
};

const isValidAddr = function (dan, suji) {
  if (1 <= dan && dan <= 3) {
    if (1 <= suji && suji <= 4) {
      const id = "s" + suji + "dan" + dan;
      const elm = document.getElementById(id);
      try {
        const koma_elm = elm.firstElementChild;
        const koma_id = koma_elm.id;
        // selectedKomaが先手駒の時
        if (FU <= selectedKoma && selectedKoma <= KIN) {
          // 目標地点の駒が味方の場合
          if (FU <= koma_id && koma_id <= KIN) {
            return false;
          } else {
            return true;
          }
        } else if (E_FU <= selectedKoma && selectedKoma <= E_KIN) {
          // 目標地点の駒が味方の場合
          if (E_FU <= koma_id && koma_id <= E_KIN) {
            return false;
          } else {
            return true;
          }
        }
      } catch {
        return true;
      }
    }
  }
};

const ClearFlgs = function () {
  selectedFlgB = false;
  selectedFlgC = false;
  battleFlg = false;
  movedFlg = false;
  promoteFlg = false;
  selectedDan = EMPTY;
  selectedSuji = EMPTY;
  selectedKoma = EMPTY;
  selectedElm = "";
  ClearKomaAddr();
  ClearAddrActive();
  ClearSelected();
  console.log("cleared");
};

const AssignKomaAddr = function () {
  komaAddr.dan = selectedDan;
  komaAddr.suji = selectedSuji;
};

const ClearKomaAddr = function () {
  komaAddr.dan = EMPTY;
  komaAddr.suji = EMPTY;
};

const AddrActive = function (dan, suji) {
  const dan_id = "s" + suji + "dan" + dan;
  const dan_elm = document.getElementById(dan_id);
  dan_elm.classList.add("moveable-place");
  addrActiveFlg = true;
};

const ClearAddrActive = function () {
  const ls = [];
  const dans = document.getElementsByClassName("moveable-place");
  for (let i = 0; i < dans.length; i++) {
    ls[i] = dans[i];
  }
  ls.forEach((elm) => {
    elm.classList.remove("moveable-place");
  });
  addrActiveFlg = false;
};

const ClearSelected = function () {
  const ls = [];
  const selected_komas = document.getElementsByClassName("selected");
  for (let i = 0; i < selected_komas.length; i++) {
    ls[i] = selected_komas[i];
    ls.forEach((elm) => {
      console.log(elm);
      elm.classList.remove("selected");
    });
  }
};
const ChangeTurn = function () {
  if (battleFlg || movedFlg || selectedFlgC) {
    UpdateKif();
    teban = !teban;
    if (!teban) {
      elm = document.getElementById("teban");
      elm.innerHTML = "後手番<br/>";
    } else {
      elm = document.getElementById("teban");
      elm.innerHTML = "先手番 <br/>";
    }
    ClearFlgs();
  } else {
    console.error("手番を変更出来ません");
  }
};
// 駒を取るときの攻撃駒を入れておく
const FromKoma = function () {
  const fid = "s" + komaAddr.suji + "dan" + komaAddr.dan;
  const from_koma = document.getElementById(fid);
  const fki = from_koma.firstElementChild.id;
  return fki;
};

// ! 棋譜の上書き
const UpdateKif = function () {
  console.log(selectedDan, selectedSuji);
  if (selectedFlgC) {
    const from = "打";
    memory.index = memory.index + 1;
    const koma = ReturnKomaName(memory.koma);
    const to = ReturnKifAddr(selectedDan, selectedSuji);
    const info = to + koma + from;
    const data = memory.index + " " + info + memory.think_time + "\n";
    kif = document.getElementById("kif");
    kif.insertAdjacentHTML("beforeend", data);
    return true;
  } else if (promoteFlg) {
    const from = "(" + memory.from.dan + memory.from.suji + ")";
    const p = "成"
    memory.index = memory.index + 1;
    const koma = "歩"
    const to = ReturnKifAddr(selectedDan, selectedSuji);
    const info = to + koma + p + from;
    const data = memory.index + " " + info + memory.think_time + "\n";
    kif = document.getElementById("kif");
    kif.insertAdjacentHTML("beforeend", data);
    return true;
  } else if (CheckMate == OU) {
    // 後手勝ちの場合
    const r = "後手勝ち";
    const data = " " + r + " " + memory.think_time
    kif = document.getElementById("kif");
    kif.insertAdjacentHTML("beforeend", data);
  }else if (CheckMate == E_OU) {
      //  先手勝ちの場合
    const r = "先手勝ち";
    const data = " " + r + " " + memory.think_time
    kif = document.getElementById("kif");
    kif.insertAdjacentHTML("beforeend", data);
  }
  else {
    const from = "(" + memory.from.dan + memory.from.suji + ")";
    memory.index = memory.index + 1;
    const koma = ReturnKomaName(memory.koma);
    const to = ReturnKifAddr(selectedDan, selectedSuji);
    const info = to + koma + from;
    const data = memory.index + " " + info + memory.think_time + "\n";
    kif = document.getElementById("kif");
    kif.insertAdjacentHTML("beforeend", data);
    return true;
  }
};

const Reinforce = function (id) {
  if (!selectedFlgC) {
    selectedFlgC = true;
  } else {
    ClearFlgs();
  }
  // 先手番の場合
  if (FU <= id && id <= KIN && teban && selectedFlgC) {
    selectedKoma = id;
    SelectedKoma(id);
  }
  // 後手番の場合
  else if (FU <= id && id <= E_KIN && !teban && selectedFlgC) {
    selectedKoma = id;
    SelectedKoma(id);
  } else {
    console.error("敵の持ち駒です");
    ClearFlgs();
  }
};
// 持ち駒を指定の場所に配置
const PlaceKoma = function () {
  const elm = selectedElm;
  if (teban) {
    elm.classList.remove("black-captured");
  } else {
    elm.classList.remove("white-captured");
  }
  elm.classList.remove("col-3");
  elm.firstElementChild.classList.remove("selected");
  elm.removeAttribute("onclick");
  const addr_id = AddrId(selectedDan, selectedSuji);
  const addr_elm = document.getElementById(addr_id);
  addr_elm.appendChild(elm);
  // ここから棋譜用の処理
  memory.from.dan = 0;
  memory.from.suji = 0;
  memory.to.dan = selectedDan;
  memory.to.suji = selectedSuji;
  memory.koma = selectedKoma;
  ChangeTurn();
};

const Promote = function (koma) {
  // 先手の歩の場合
  console.log(koma);
  if (koma == FU && isBlackTerritory()) {
    const kin = document.getElementById(KIN);
    const to = kin.cloneNode(true);
    const fid = "s" + komaAddr.suji + "dan" + komaAddr.dan;
    const addr = document.getElementById(fid);
    const fk = addr.firstElementChild;
    try {
      //敵の駒がいる場合
      const targ_addr_id = "s" + selectedSuji + "dan" + selectedDan;
      const targ_addr = document.getElementById(targ_addr_id);
      const targ = targ_addr.firstElementChild.id;
      if (targ_addr.classList.contains("moveable-place")) {
        if (fk.id == FU) {
          fk.remove();
          addr.appendChild(to);
        }
        promoteFlg = true;
        TakeKoma(targ);
      }
    } catch {
      //敵の駒がいない場合
      if (fk) {
        if (fk.id == FU) {
          fk.remove();
          addr.appendChild(to);
        }
      }
      promoteFlg = true;
      MoveKoma();
    }
  }
  // 後手の歩の場合
  else if (koma == E_FU && isWhiteTerritory()) {
    const kin = document.getElementById(E_KIN);
    const to = kin.cloneNode(true);
    const fid = "s" + komaAddr.suji + "dan" + komaAddr.dan;
    const addr = document.getElementById(fid);
    const fk = addr.firstElementChild;
    const fkid = fk.id;
    try {
      //敵の駒がいる場合
      const targ_addr_id = "s" + selectedSuji + "dan" + selectedDan;
      const targ_addr = document.getElementById(targ_addr_id);
      const targ = targ_addr.firstElementChild.id;
      if (targ_addr.classList.contains("moveable-place")) {
        if (fkid == E_FU) {
          fk.remove();
          addr.appendChild(to);
        }
        promoteFlg = true;
        TakeKoma(targ);
      }
    } catch {
      //敵の駒がいない場合
      if (fkid == E_FU) {
        fk.remove();
        addr.appendChild(to);
      }
      promoteFlg = true;
      MoveKoma();
    }
  }
};

const GameOver = function (king) {
  if (king == OU) {
    alert("後手の勝ち");
    ResetGame();
  } else {
    alert("先手の勝ち");
    ResetGame();
  }
};

const ResetGame = function () {
  // ゲーム終了時に起動
  console.error("game over");
};
//升目がクリックされたとき
const SelectedAddress = function (dan, suji) {
  if (dan && suji) {
    selectedDan = dan;
    selectedSuji = suji;
    const addr_id = AddrId(dan, suji);
    const element = document.getElementById(addr_id);
    try {
      const koma = element.firstElementChild;
      const koma_id = koma.id;
      SelectedKoma(koma_id);
    } catch {
      // 空白マスならcatch
      if (selectedFlgB && selectedKoma == FU && isBlackTerritory()) {
        Promote(selectedKoma);
      } else if (selectedFlgB && selectedKoma == E_FU && isWhiteTerritory()) {
        Promote(selectedKoma);
      } else if (selectedFlgB && selectedKoma !== EMPTY) {
        MoveKoma();
      } else if (selectedFlgC && selectedKoma == FU) {
        // 先手歩の場合、敵陣にはおけない
        if (isBlackTerritory()) {
          console.error("そこにはおけません");
          ClearFlgs();
        } else {
          PlaceKoma();
        }
      } else if (selectedFlgC && selectedKoma == E_FU) {
        console.log("そこにはおけません");
        if (isWhiteTerritory()) {
          console.error("そこにはおけません");
          ClearFlgs();
        } else {
          PlaceKoma();
        }
      } else if (selectedFlgC && selectedKoma !== EMPTY) {
        PlaceKoma();
      }
    }
  }
};

// 盤上の駒がクリックされたとき
const SelectedKoma = function (koma) {
  koma = +koma;
  //選択されている駒がない場合
  if (!selectedFlgB && !selectedFlgC) {
    // 元の駒の現在地の割り振り
    AssignKomaAddr();
    // 先手番の場合
    if (FU <= koma && koma <= KIN && teban) {
      selectedKoma = koma;
      selectedFlgB = true;
      if (selectedSuji && selectedDan) {
        MoveAblePlaces();
      }
    }
    // 後手番の場合
    else if (E_FU <= koma && koma <= E_KIN && !teban) {
      selectedKoma = koma;
      selectedFlgB = true;
      if (selectedSuji && selectedDan) {
        MoveAblePlaces();
      }
      // 相手の駒を選んだ場合
    } else {
      console.log("相手の駒は選べません");
    }
  }
  // 盤上の駒が選ばれていた場合
  else if (selectedFlgB && selectedKoma !== EMPTY) {
    // 先手番の場合
    if (teban) {
      const fk = FromKoma();
      if (fk == FU && isBlackTerritory()) {
        Promote(fk);
      }
      //自身の駒を選んだ場合
      else if (FU <= koma && koma <= KIN) {
        // * elseにまとめて良いかも
        ClearFlgs();
      }
      // 相手の駒を選んだ場合
      else if (E_FU <= koma && koma <= E_KIN) {
        const targ_id = "s" + selectedSuji + "dan" + selectedDan;
        const elm = document.getElementById(targ_id);
        if (elm.classList.contains("moveable-place")) {
          TakeKoma(koma);
        }
      } else {
        ClearFlgs();
      }
    }
    //後手番の場合
    else if (!teban) {
      // 相手の駒を選んだ場合
      const fk = FromKoma();
      if (fk == E_FU && isWhiteTerritory()) {
        console.error("promet");
        Promote(fk);
      } else if (FU <= koma && koma <= KIN) {
        const targ_id = "s" + selectedSuji + "dan" + selectedDan;
        const elm = document.getElementById(targ_id);
        if (elm.classList.contains("moveable-place")) {
          TakeKoma(koma);
        }
      } else {
        ClearFlgs();
      }
    }
  }
  // 駒台の駒が選ばれた場合
  else if (selectedFlgC && selectedKoma !== EMPTY) {
    let elm;
    // 先手の場合
    if (FU <= koma && koma <= KIN && teban) {
      const elms = document.getElementsByClassName("black-captured");
      for (let i = 0; i < elms.length; i++) {
        if (elms[i].id == koma) {
          elm = elms[i];
        }
      }
      elm.firstElementChild.classList.add("selected");
      selectedElm = elm;
    } else if (E_FU <= koma && koma <= E_KIN && !teban) {
      //後手の場合
      const elms = document.getElementsByClassName("white-captured");
      for (let i = 0; i < elms.length; i++) {
        if (elms[i].id == koma) {
          elm = elms[i];
        }
      }
      elm.firstElementChild.classList.add("selected");
      selectedElm = elm;
    }
  }
};

//空白スペースへ駒が動くための関数
const MoveKoma = function () {
  const destination_id = AddrId(selectedDan, selectedSuji); // 移動先のマスID
  const elm = document.getElementById(destination_id); // 移動先のエレメント
  if (elm.classList.contains("moveable-place")) {
    const fixed_koma_addr = "s" + komaAddr.suji + "dan" + komaAddr.dan; // 元の駒のマス
    const element = document.getElementById(fixed_koma_addr);
    const koma_elm = element.firstElementChild;
    const addr_elm = document.getElementById(destination_id);
    addr_elm.appendChild(koma_elm);
    // ここから棋譜用の処理
    memory.from.dan = komaAddr.dan;
    memory.from.suji = komaAddr.suji;
    memory.to.dan = selectedDan;
    memory.to.suji = selectedSuji;
    memory.koma = koma_elm.id;
    movedFlg = true;
    ChangeTurn();
    //移動完了
  } else {
    console.error("not moveable");
    // 移動失敗
  }
  // 処理終了
};

const TakeKoma = function (koma) {
  koma = +koma;
  // 先手の王が取られる場合
  if (koma == OU) {
    CheckMate = OU
    UpdateKif()
    GameOver(OU); // 後手の勝ち
  } else if (koma == E_OU) {
    CheckMate = E_OU;
    UpdateKif()
    GameOver(E_OU); // 先手の勝ち
  } else if (koma == KIN) {
    // 金が取られるとき
    const f_dan = komaAddr.dan;
    const f_suji = komaAddr.suji;
    const from_addr = AddrId(f_dan, f_suji); // 攻撃する駒の情報取得
    const from_addr_elm = document.getElementById(from_addr);
    const attack_koma = from_addr_elm.firstElementChild;
    const targ_addr = AddrId(selectedDan, selectedSuji); // 取られる駒の情報
    const targ_addr_elm = document.getElementById(targ_addr);
    const targ_koma = targ_addr_elm.firstElementChild;
    targ_koma.remove();

    const komadai = document.getElementById("gote-komadai"); // 駒台
    const efu = document.getElementById(E_FU);
    const ef = efu.cloneNode(true);
    ef.classList.add("col-3");
    ef.classList.add("white-captured");
    const func = "Reinforce(" + E_FU + ")";
    ef.setAttribute("onclick", func);
    komadai.appendChild(ef); // 駒台に取る駒をのせる
    targ_addr_elm.appendChild(attack_koma); // 攻撃した駒を移動
    // ここから棋譜用の処理
    memory.from.dan = komaAddr.dan;
    memory.from.suji = komaAddr.suji;
    memory.to.dan = selectedDan;
    memory.to.suji = selectedSuji;
    memory.koma = attack_koma.id;
    battleFlg = true;
    ChangeTurn();
  } else if (koma == E_KIN) {
    // 後手の金が取られる場合
    const f_dan = komaAddr.dan;
    const f_suji = komaAddr.suji;
    const from_addr = AddrId(f_dan, f_suji); // 攻撃する駒の情報取得
    const from_addr_elm = document.getElementById(from_addr);
    const attack_koma = from_addr_elm.firstElementChild;
    const targ_addr = AddrId(selectedDan, selectedSuji); // 取られる駒の情報
    const targ_addr_elm = document.getElementById(targ_addr);
    const targ_koma = targ_addr_elm.firstElementChild;
    targ_koma.remove();

    const komadai = document.getElementById("sente-komadai"); // 駒台
    const fu = document.getElementById(FU);
    const f = fu.cloneNode(true);
    f.classList.add("col-3");
    f.classList.add("black-captured");
    const func = "Reinforce(" + FU + ")";
    f.setAttribute("onclick", func);
    komadai.appendChild(f); // 駒台に取る駒をのせる
    targ_addr_elm.appendChild(attack_koma); // 攻撃した駒を移動
    // ここから棋譜用の処理
    memory.from.dan = komaAddr.dan;
    memory.from.suji = komaAddr.suji;
    memory.to.dan = selectedDan;
    memory.to.suji = selectedSuji;
    memory.koma = attack_koma.id;
    battleFlg = true;
    ChangeTurn();
  } else {
    console.log("taking koma");
    const f_dan = komaAddr.dan;
    const f_suji = komaAddr.suji;
    // 攻撃する駒の情報取得
    const from_addr = AddrId(f_dan, f_suji);
    const from_addr_elm = document.getElementById(from_addr);
    const attack_koma = from_addr_elm.firstElementChild;
    console.log(attack_koma);
    // 取られる駒の情報取得
    const targ_addr = AddrId(selectedDan, selectedSuji);
    const targ_addr_elm = document.getElementById(targ_addr);
    const targ_koma = targ_addr_elm.firstElementChild;
    // 後手が駒を取った場合
    console.log(koma);
    if (FU <= koma && koma <= KIN) {
      const komadai = document.getElementById("gote-komadai"); //駒台情報
      const ekid = koma + ENEMY; //後手駒のID取得
      const ekelm = document.getElementById(ekid);
      const ekk = ekelm.cloneNode(true);
      ekk.classList.add("col-3"); // 駒台用にelement加工
      ekk.classList.add("white-captured");
      const func = "Reinforce(" + ekid + ")";
      ekk.setAttribute("onclick", func);
      targ_koma.remove(); //取る駒の情報を取り除く
      komadai.appendChild(ekk); // 駒台に取る駒をのせる
      targ_addr_elm.appendChild(attack_koma); // 攻撃した駒を移動
    }
    // 先手が駒を取った場合
    else if (E_FU <= koma && koma <= E_KIN) {
      console.log("taking enemy koma");
      const komadai = document.getElementById("sente-komadai"); //駒台情報
      const kid = koma - ENEMY; // 先手駒のID取得
      const kelm = document.getElementById(kid);
      const kk = kelm.cloneNode(true);
      kk.classList.add("col-3"); // 駒台用にelement加工
      kk.classList.add("black-captured");
      console.log(kid);
      const func = "Reinforce(" + kid + ")";
      kk.setAttribute("onclick", func);
      targ_koma.remove(); //取る駒の情報を取り除く
      komadai.appendChild(kk); // 駒台に取る駒をのせる
      targ_addr_elm.appendChild(attack_koma); // 攻撃した駒を移動
    }
    // ここから棋譜用の処理
    memory.from.dan = komaAddr.dan;
    memory.from.suji = komaAddr.suji;
    memory.to.dan = selectedDan;
    memory.to.suji = selectedSuji;
    memory.koma = attack_koma.id;
    battleFlg = true;
    ChangeTurn();
  }
};

const MoveAblePlaces = function () {
  const a_dan = selectedDan + 1;
  const m_dan = selectedDan - 1;
  const a_suji = selectedSuji + 1;
  const m_suji = selectedSuji - 1;
  const dan_ls = [a_dan, m_dan];
  const suji_ls = [a_suji, m_suji];
  const move_ls = [1, -1];
  if (selectedDan && selectedSuji && selectedKoma) {
    // 黒歩の場合
    if (selectedKoma == 1) {
      const suji = selectedSuji + 1;
      const dan = selectedDan;
      if (isValidAddr(dan, suji)) {
        AddrActive(dan, suji);
      }
    }
    //白歩の場合
    else if (selectedKoma == 7) {
      const suji = selectedSuji - 1;
      const dan = selectedDan;
      if (isValidAddr(dan, suji)) {
        AddrActive(dan, suji);
      }
    }
    // 角の場合
    else if (selectedKoma == 2 || selectedKoma == 8) {
      for (let i = 0; i <= 1; i++) {
        for (let j = 0; j <= 1; j++) {
          const dan = dan_ls[i];
          const suji = suji_ls[j];
          if (isValidAddr(dan, suji)) {
            AddrActive(dan, suji);
          }
        }
      }
    }
    // 飛車の場合
    else if (selectedKoma == 3 || selectedKoma == 9) {
      for (i = 0; i <= 1; i++) {
        for (j = 0; j <= 1; j++) {
          if (i == 0) {
            const dan = selectedDan;
            const suji = selectedSuji + move_ls[j];
            if (isValidAddr(dan, suji)) {
              AddrActive(dan, suji);
            }
          } else {
            const dan = selectedDan + move_ls[j];
            const suji = selectedSuji;
            if (isValidAddr(dan, suji)) {
              AddrActive(dan, suji);
            }
          }
        }
      }
    }
    //王の場合
    else if (selectedKoma == 4 || selectedKoma == 10) {
      console.log("king");
      for (i = -1; i <= 1; i++) {
        for (j = -1; j <= 1; j++) {
          // i,jが両方0の場合移動なし
          const dan = selectedDan + i;
          const suji = selectedSuji + j;
          console.log(dan, suji);
          if (dan == komaAddr.dan && suji == komaAddr.suji) {
            console.log("same place");
          } else if (isValidAddr(dan, suji)) {
            AddrActive(dan, suji);
          }
        }
      }
    }
    //黒金の場合
    else if (selectedKoma == 5) {
      // 後ろ以外の動き
      for (i = 0; i <= 1; i++) {
        for (j = -1; j <= 1; j++) {
          const suji = selectedSuji + i;
          const dan = selectedDan + j;

          if (isValidAddr(dan, suji)) {
            AddrActive(dan, suji);
          }
        }
      }
      // 後ろの動き
      const dan = selectedDan;
      const suji = selectedSuji - 1;
      if (isValidAddr(dan, suji)) {
        AddrActive(dan, suji);
      }
    }
    // 白金の場合
    else if (selectedKoma == 11) {
      // 後ろ以外の動き
      for (i = -1; i <= 0; i++) {
        for (j = -1; j <= 1; j++) {
          const suji = selectedSuji + i;
          const dan = selectedDan + j;
          if (isValidAddr(dan, suji)) {
            AddrActive(dan, suji);
          }
        }
      }
      // 後ろの動き
      const dan = selectedDan;
      const suji = selectedSuji + 1;
      if (isValidAddr(dan, suji)) {
        AddrActive(dan, suji);
      }
    }
  }
};

window.onload = function () {
  teban = true; //先手番
  selectedFlgB = false; // 盤上の選択駒を初期化
  selectedFlgC = false; // 駒台の選択ごまを初期化
  selectedKoma = EMPTY; // 最初空

  pieceBoard = [
    document.getElementById("1"),
    document.getElementById("2"),
    document.getElementById("3"),
    document.getElementById("4"),
    document.getElementById("5"),
    document.getElementById("6"),
    document.getElementById("7"),
    document.getElementById("8"),
    document.getElementById("9"),
    document.getElementById("10"),
    document.getElementById("11"),
  ];
};
