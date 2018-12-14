!function (e) {
  var t = function () {
      function t (e, t) {
        var i = this
        this.scale = 1,
        this.during_move = !1,
        this.mouse_start_x = 0,
        this.mouse_start_y = 0,
        this.me = e,
        this.container_illust = t,
        this.illust = this.container_illust.getChildByName('illust'),
        this.container_move = e.getChildByName('move'),
        this.container_move.on('mousedown', this, function () {
          i.during_move = !0,
          i.mouse_start_x = i.container_move.mouseX,
          i.mouse_start_y = i.container_move.mouseY
        }),
        this.container_move.on('mousemove', this, function () {
          i.during_move && (i.move(i.container_move.mouseX - i.mouse_start_x, i.container_move.mouseY - i.mouse_start_y),
          i.mouse_start_x = i.container_move.mouseX,
          i.mouse_start_y = i.container_move.mouseY)
        }),
        this.container_move.on('mouseup', this, function () {
          i.during_move = !1
        }),
        this.container_move.on('mouseout', this, function () {
          i.during_move = !1
        }),
        this.btn_big = e.getChildByName('btn_big'),
        this.btn_big.clickHandler = Laya.Handler.create(this, function () {
          i.locking || i.bigger()
        }, null, !1),
        this.btn_small = e.getChildByName('btn_small'),
        this.btn_small.clickHandler = Laya.Handler.create(this, function () {
          i.locking || i.smaller()
        }, null, !1),
        this.btn_close = e.getChildByName('btn_close'),
        this.btn_close.clickHandler = Laya.Handler.create(this, function () {
          i.locking || i.close()
        }, null, !1)
      }
      return t.prototype.show = function (t) {
          var n = this
          this.locking = !0,
          this.when_close = t,
          this.illust_start_x = this.illust.x,
          this.illust_start_y = this.illust.y,
          this.illust_center_x = this.illust.x + 984 - 446,
          this.illust_center_y = this.illust.y + 11 - 84,
          this.container_illust.getChildByName('container_name').visible = !1,
          this.container_illust.getChildByName('btn').visible = !1,
          i.Inst.stopsay(),
          this.scale = 1,
          Laya.Tween.to(this.illust, {
            x: this.illust_center_x,
            y: this.illust_center_y
          }, 200),
          e.UIBase.anim_pop_out(this.btn_big, null),
          e.UIBase.anim_pop_out(this.btn_small, null),
          e.UIBase.anim_pop_out(this.btn_close, null),
          this.during_move = !1,
          Laya.timer.once(250, this, function () {
            n.locking = !1
          }),
          this.me.visible = !0
        }
        ,
        t.prototype.close = function () {
          var t = this
          this.locking = !0,
          this.container_illust.getChildByName('container_name').visible = !0,
          this.container_illust.getChildByName('btn').visible = !0,
          Laya.Tween.to(this.illust, {
            x: this.illust_start_x,
            y: this.illust_start_y,
            scaleX: 1,
            scaleY: 1
          }, 200),
          e.UIBase.anim_pop_hide(this.btn_big, null),
          e.UIBase.anim_pop_hide(this.btn_small, null),
          e.UIBase.anim_pop_hide(this.btn_close, null),
          Laya.timer.once(250, this, function () {
            t.locking = !1,
            t.me.visible = !1,
            t.when_close.run()
          })
        }
        ,
        t.prototype.bigger = function () {
          1.1 * this.scale > 1.5 || (this.scale *= 1.1,
          Laya.Tween.to(this.illust, {
            scaleX: this.scale,
            scaleY: this.scale
          }, 100, null, null, 0, !0, !0))
        }
        ,
        t.prototype.smaller = function () {
          this.scale / 1.1 < .5 || (this.scale /= 1.1,
          Laya.Tween.to(this.illust, {
            scaleX: this.scale,
            scaleY: this.scale
          }, 100, null, null, 0, !0, !0))
        }
        ,
        t.prototype.move = function (e, t) {
          var i = this.illust.x + e,
            n = this.illust.y + t
          i < this.illust_center_x - 600 ? i = this.illust_center_x - 600 : i > this.illust_center_x + 600 && (i = this.illust_center_x + 600),
          n < this.illust_center_y - 1200 ? n = this.illust_center_y - 1200 : n > this.illust_center_y + 800 && (n = this.illust_center_y + 800),
          this.illust.x = i,
          this.illust.y = n
        }
        ,
        t
    }(),
    i = function (i) {
      function n () {
        var e = i.call(this, new ui.lobby.susheUI) || this
        return e.contianer_illust = null,
          e.illust = null,
          e.label_name = null,
          e.label_cv = null,
          e.container_page = null,
          e.container_look_illust = null,
          e.page_select_character = null,
          e.page_visit_character = null,
          e.origin_illust_x = 0,
          e.chat_id = 0,
          e.select_index = 0,
          e.container_chat = null,
          e.sound_channel = null,
          e.chat_block = null,
          n.Inst = e,
          e
      }
      return __extends(n, i),
        n.init = function (t) {
          var UI_Sushe = this
          var characters = [
            {
              charid: 200001,
              level: 5,
              exp: 0,
              views: [],
              skin: 400102,
              is_upgraded: !0
            },
            {
              charid: 200002,
              level: 5,
              exp: 0,
              views: [],
              skin: 400202,
              is_upgraded: !0
            },
            {
              charid: 200003,
              level: 5,
              exp: 0,
              views: [],
              skin: 400302,
              is_upgraded: !0
            },
            {
              charid: 200004,
              level: 5,
              exp: 0,
              views: [],
              skin: 400402,
              is_upgraded: !0
            },
            {
              charid: 200005,
              level: 5,
              exp: 0,
              views: [],
              skin: 400502,
              is_upgraded: !0
            },
            {
              charid: 200006,
              level: 5,
              exp: 0,
              views: [],
              skin: 400602,
              is_upgraded: !0
            }
          ]
          UI_Sushe.characters = [],
            UI_Sushe.characters.push(...characters),
            UI_Sushe.skin_map[400101] = 1,
            UI_Sushe.skin_map[400201] = 1,
            UI_Sushe.skin_map[400301] = 1,
            UI_Sushe.skin_map[400401] = 1,
            UI_Sushe.skin_map[400501] = 1,
            UI_Sushe.skin_map[400601] = 1,
            UI_Sushe.skin_map[400102] = 1,
            UI_Sushe.skin_map[400202] = 1,
            UI_Sushe.skin_map[400302] = 1,
            UI_Sushe.skin_map[400402] = 1,
            UI_Sushe.skin_map[400502] = 1,
            UI_Sushe.skin_map[400602] = 1,
          UI_Sushe.main_character_id = 200004

          UI_Sushe.send_gift_count = 0,
          UI_Sushe.send_gift_limit = 0,
          // res.send_gift_count && (UI_Sushe.send_gift_count = res.send_gift_count),
          // res.send_gift_limit && (UI_Sushe.send_gift_limit = res.send_gift_limit),
          t.run()
        /* app.NetAgent.sendReq2Lobby('Lobby', 'fetchCharacterInfo', {}, function (n, res) {
          if (n || res.error)
            e.UIMgr.Inst.showNetReqError('fetchCharacterInfo', n, res)
          else {
            if (app.Log.log('fetchCharacterInfo: ' + JSON.stringify(res)),
              (res = JSON.parse(JSON.stringify(res))).main_character_id && res.characters) {
              if (UI_Sushe.characters = [],
                res.characters)
                for (r = 0; r < res.characters.length; r++)
                  UI_Sushe.characters.push(res.characters[r])
              if (UI_Sushe.skin_map = {},
                res.skins)
                for (var r = 0; r < res.skins.length; r++)
                  UI_Sushe.skin_map[res.skins[r]] = 1
              UI_Sushe.main_character_id = res.main_character_id
            } else
              
          }
        }) */
        }
        ,
        n.on_data_updata = function (e) {
          if (e.character) {
            var t = JSON.parse(JSON.stringify(e.character))
            if (t.characters)
              for (var i = t.characters, n = 0; n < i.length; n++)
                this.characters.push(i[n])
            if (t.skins)
              for (var a = t.skins, n = 0; n < a.length; n++)
                this.skin_map[a[n]] = 1
          }
        }
        ,
        n.chara_owned = function (e) {
          for (var t = 0; t < this.characters.length; t++)
            if (this.characters[t].charid == e)
              return !0
          return !1
        }
        ,
        n.skin_owned = function (e) {
          return this.skin_map.hasOwnProperty(e.toString())
        }
        ,
        Object.defineProperty(n, 'main_chara_info', {
          get: function () {
            for (var e = 0; e < this.characters.length; e++)
              if (this.characters[e].charid == this.main_character_id)
                return this.characters[e]
            return null
          },
          enumerable: !0,
          configurable: !0
        }),
        n.prototype.onCreate = function () {
          var i = this
          this.contianer_illust = this.me.getChildByName('illust'),
          this.illust = new e.UI_Character_Skin(this.contianer_illust.getChildByName('illust').getChildByName('illust')),
          this.container_chat = this.contianer_illust.getChildByName('chat'),
          this.chat_block = new e.UI_Character_Chat(this.container_chat),
          this.contianer_illust.getChildByName('btn').clickHandler = Laya.Handler.create(this, function () {
            i.page_visit_character.me.visible && i.page_visit_character.cannot_click_say || (i.sound_channel ? i.stopsay() : i.say('lobby_normal'))
          }, null, !1),
          this.label_name = this.contianer_illust.getChildByName('container_name').getChildByName('label_name'),
          this.label_cv = this.contianer_illust.getChildByName('container_name').getChildByName('label_CV'),
          this.origin_illust_x = this.contianer_illust.x,
          this.container_page = this.me.getChildByName('container_page'),
          this.page_select_character = new e.UI_Sushe_Select,
          this.container_page.addChild(this.page_select_character.me),
          this.page_visit_character = new e.UI_Sushe_Visit,
          this.container_page.addChild(this.page_visit_character.me),
          this.container_look_illust = new t(this.me.getChildByName('look_illust'), this.contianer_illust)
        }
        ,
        n.prototype.show = function () {
          GameMgr.Inst.BehavioralStatistics(15),
          game.Scene_Lobby.Inst.change_bg('indoor', !1),
          this.enable = !0,
          this.page_visit_character.me.visible = !1
          for (var e = 0, t = 0; t < n.characters.length; t++)
            if (n.characters[t].charid == n.main_character_id) {
              e = t
              break
          }
          this.change_select(e),
          this.show_page_select(),
          this.container_look_illust.me.visible = !1
        }
        ,
        n.prototype.starup_back = function () {
          this.enable = !0,
          this.change_select(this.select_index),
          this.show_page_visit(!0)
        }
        ,
        n.prototype.go2Lobby = function () {
          this.close(Laya.Handler.create(this, function () {
            e.UIMgr.Inst.showLobby()
          }))
        }
        ,
        n.prototype.close = function (t) {
          var i = this
          e.UIBase.anim_alpha_out(this.contianer_illust, {
            x: -30
          }, 150, 0),
          Laya.timer.once(150, this, function () {
            i.enable = !1,
            t.run()
          })
        }
        ,
        n.prototype.onDisable = function () {
          this.illust.clear(),
          this.stopsay()
        }
        ,
        n.prototype.show_page_select = function () {
          this.page_select_character.show(this.select_index)
        }
        ,
        n.prototype.show_page_visit = function (e) {
          this.page_visit_character.show(n.characters[this.select_index], e)
        }
        ,
        n.prototype.change_select = function (t) {
          this.select_index = t,
          this.illust.clear()
          var i = n.characters[t]
          this.label_name.text = cfg.item_definition.character.get(i.charid).name,
          this.label_cv.text = 'CV' + cfg.item_definition.character.get(i.charid).desc_cv,
          this.illust.setSkin(i.skin, 'full'),
          Laya.Tween.clearAll(this.contianer_illust),
          this.contianer_illust.x = this.origin_illust_x,
          this.contianer_illust.alpha = 1,
          e.UIBase.anim_alpha_in(this.contianer_illust, {
            x: -30
          }, 230),
          this.stopsay()
        }
        ,
        n.prototype.onChangeSkin = function (e) {
          n.characters[this.select_index].skin = e,
          this.change_select(this.select_index),
          n.characters[this.select_index].charid == n.main_character_id && (GameMgr.Inst.account_data.avatar_id = e),
          app.NetAgent.sendReq2Lobby('Lobby', 'changeCharacterSkin', {
            character_id: n.characters[this.select_index].charid,
            skin: e
          }, function (e, t) {})
        }
        ,
        n.prototype.say = function (e) {
          var t = this,
            i = n.characters[this.select_index]
          this.chat_id++
          var a = this.chat_id,
            r = view.AudioMgr.PlayCharactorSound(i, e, Laya.Handler.create(this, function () {
              Laya.timer.once(1e3, t, function () {
                a == t.chat_id && t.stopsay()
              })
            }))
          r && (this.chat_block.show(r.words),
          this.sound_channel = r.sound)
        }
        ,
        n.prototype.stopsay = function () {
          this.chat_block.close(!1),
          this.sound_channel && (this.sound_channel.stop(),
          Laya.SoundManager.removeChannel(this.sound_channel),
          this.sound_channel = null)
        }
        ,
        n.prototype.to_look_illust = function () {
          var e = this
          this.container_look_illust.show(Laya.Handler.create(this, function () {
            e.page_select_character.show(e.select_index)
          }))
        }
        ,
        n.characters = [],
        n.skin_map = {},
        n.main_character_id = 0,
        n.send_gift_count = 0,
        n.send_gift_limit = 0,
        n.Inst = null,
        n
    }(e.UIBase)
  e.UI_Sushe = i
}(uiscript || (uiscript = {}));

