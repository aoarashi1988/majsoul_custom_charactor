!function(e,u,i,am) {
    var _cy_riched;
    var _cy_myrich;
    var _cy_cur_bgm;
    var _cy_fc;
    var _cy_bgmidx;
    var _cy_tk;
    var tmp;

    am.PlayMusic = (()=>{
        var o = am.PlayMusic;
        return function(e, i) {
            return e != "music/game.mp3" && !_cy_fc && o.apply(this, arguments)
        }
    })(),

    paiRemain = () => { 
        return i.Inst.left_tile_count <= 20; 
    },

    playMusic = () => {
        var t = "";
        if(_cy_riched) {
            t = "r" + (_cy_riched > 1 ? 3 : _cy_myrich ? 2 : 1)
        } else {
            t = paiRemain() ? "p" : _cy_bgmidx%8+"";
        }
        _cy_cur_bgm = !t ? _cy_cur_bgm : "my_music/" + t + ".mp3";
        !_cy_fc && _cy_cur_bgm && i.Inst.gameing && am.PlayMusic(_cy_cur_bgm)
    },

    e.ViewPlayer.prototype.AddQiPai = (function(){
        var o = e.ViewPlayer.prototype.AddQiPai;
        return function(r,x,y,z) {
            return x && (++_cy_riched, _cy_myrich = this.container_qipai.player.seat == i.Inst.seat, playMusic()) ,o.apply(this, arguments)
        }
    })(),

    newRound = function(t) {
        if(!_cy_tk && i.Inst) {
            _cy_tk = 1;
            i.Inst.RefreshPaiLeft = (() => {
                var o = i.Inst.RefreshPaiLeft;
                return function(a, b) {
                    return paiRemain() && playMusic(), o.apply(this, arguments)
                }
            })();
        }
        _cy_cur_bgm = "";
        _cy_bgmidx = t.chang*4 + t.ju;
        _cy_riched = 0;
        new Error().stack.split('\n')[2].match(/fastrecord/) && (_cy_fc = 1);
        playMusic();
    },

    "play fastplay record fastrecord".split(" ").forEach((i) => {
        e.ActionNewRound[i] = (()=>{
            var o = e.ActionNewRound[i];
            return function(t) {
                return tmp = o.apply(this, arguments), newRound(t), tmp
            }
        })()
    }),

    Object.entries({ Replay:"_refreshBarshow", Live_Broadcast:"_fastSync" }).forEach(([k,v]) => {
        u["UI_"+k]["prototype"][v] = (()=>{
            var o = u["UI_"+k]["prototype"][v];
            return function() {
                return tmp = o.apply(this, arguments), _cy_fc && (_cy_fc = 0, playMusic()), tmp
            }
        })()
    })

}(view, uiscript, view.DesktopMgr, view.AudioMgr);