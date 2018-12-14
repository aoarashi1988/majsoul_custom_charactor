!function (e) {
  var t = function (t) {
    function i () {
      var e = t.call(this, new ui.lobby.sushe_selectUI) || this
      return e.container_top = null,
        e.container_heads = null,
        e.scrollview = null,
        e.btn_visit = null,
        e.btn_look = null,
        e.select_index = 0,
        e.locking = !1,
        e
    }
    return __extends(i, t),
      i.prototype.onCreate = function () {
        var t = this
        this.container_top = this.me.getChildByName('top'),
        this.container_heads = this.me.getChildByName('heads'),
        this.scrollview = this.container_heads.scriptMap['capsui.CScrollView'],
        this.scrollview.init_scrollview(new Laya.Handler(this, this.render_character_cell), -1, 3),
        this.btn_visit = this.me.getChildByName('heads').getChildByName('btn_visit'),
        this.btn_visit.clickHandler = Laya.Handler.create(this, function () {
          t.locking || (t.close(),
          Laya.timer.once(150, t, function () {
            e.UI_Sushe.Inst.show_page_visit(!1)
          }))
        }, null, !1),
        this.btn_look = this.me.getChildByName('btn_look'),
        this.btn_look.clickHandler = Laya.Handler.create(this, function () {
          t.locking || (t.close(),
          Laya.timer.once(150, t, function () {
            e.UI_Sushe.Inst.to_look_illust()
          }))
        }, null, !1),
        this.container_top.getChildByName('btn_back').clickHandler = Laya.Handler.create(this, function () {
          t.locking || (t.close(),
          e.UI_Sushe.Inst.go2Lobby())
        }, null, !1)
      }
      ,
      i.prototype.show = function (t) {
        var i = this
        this.enable = !0,
        this.locking = !0,
        e.UIBase.anim_alpha_in(this.container_top, {
          y: -30
        }, 200),
        e.UIBase.anim_alpha_in(this.container_heads, {
          x: 30
        }, 200),
        e.UIBase.anim_alpha_in(this.btn_look, {
          x: -30
        }, 200),
        Laya.timer.once(200, this, function () {
          i.locking = !1
        }),
        this.select_index = t,
        this.scrollview.reset(),
        this.scrollview.addItem(e.UI_Sushe.characters.length)
      }
      ,
      i.prototype.close = function () {
        var t = this
        this.locking = !0,
        e.UIBase.anim_alpha_out(this.container_top, {
          y: -30
        }, 150),
        e.UIBase.anim_alpha_out(this.container_heads, {
          x: 30
        }, 150, 0),
        e.UIBase.anim_alpha_out(this.btn_look, {
          x: -30
        }, 150),
        Laya.timer.once(150, this, function () {
          t.locking = !1,
          t.enable = !1
        })
      }
      ,
      i.prototype.onDisable = function () {
        for (var t = 0; t < e.UI_Sushe.characters.length; t++)
          Laya.loader.clearTextureRes(cfg.item_definition.skin.get(e.UI_Sushe.characters[t].skin) + '/bighead.png')
      }
      ,
      i.prototype.render_character_cell = function (t) {
        var i = this,
          n = t.index,
          a = t.container,
          r = t.cache_data
        r.index = n,
        r.inited || (r.inited = !0,
        a.getChildByName('btn').clickHandler = new Laya.Handler(this, function () {
          i.onClickAtHead(r.index)
        }
        ),
        r.skin = new e.UI_Character_Skin(a.getChildByName('btn').getChildByName('head')))
        var o = a.getChildByName('btn')
        o.getChildByName('choose').visible = n == this.select_index,
        r.skin.setSkin(e.UI_Sushe.characters[n].skin, 'bighead'),
        o.getChildByName('using').visible = e.UI_Sushe.characters[n].charid == e.UI_Sushe.main_character_id,
        o.getChildByName('label_name').text = cfg.item_definition.character.find(e.UI_Sushe.characters[n].charid).name
      }
      ,
      i.prototype.onClickAtHead = function (t) {
        if (this.select_index == t) {
          if (e.UI_Sushe.characters[t].charid != e.UI_Sushe.main_character_id) {
            var i = e.UI_Sushe.main_character_id
            e.UI_Sushe.main_character_id = e.UI_Sushe.characters[t].charid,
            app.NetAgent.sendReq2Lobby('Lobby', 'changeMainCharacter', {
              character_id: e.UI_Sushe.main_character_id
            }, function (e, t) {}),
            GameMgr.Inst.account_data.avatar_id = e.UI_Sushe.characters[t].skin
            for (var n = 0; n < e.UI_Sushe.characters.length; n++)
              e.UI_Sushe.characters[n].charid == i && this.scrollview.wantToRefreshItem(n)
            this.scrollview.wantToRefreshItem(t)
          }
        } else {
          var a = this.select_index
          this.select_index = t,
          this.scrollview.wantToRefreshItem(a),
          this.scrollview.wantToRefreshItem(t),
          e.UI_Sushe.Inst.change_select(t)
        }
      }
      ,
      i
  }(e.UIBase)
  e.UI_Sushe_Select = t
}(uiscript || (uiscript = {}))
