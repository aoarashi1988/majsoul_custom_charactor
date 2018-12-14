!function (e) {
    var t = function () {
        function e(e) {
            this.speed = .001,
                this.hearts = [],
                this.heart_masks = [],
                this.exp_limits = [],
                this.preframe_time = 0,
                this.heart_count = 5,
                this.during_change = !1,
                this.me = e,
                this.container_hearts = this.me.getChildByName("hearts");
            for (i = 0; i < 5; i++) {
                var t = this.container_hearts.getChildAt(i);
                this.hearts.push(t),
                    this.heart_masks.push(t.getChildByName("v").mask)
            }
            this.bg_hearts = this.me.getChildByName("bg_hearts"),
                this.exp_limits = [];
            for (var i = 0; i < 5; i++)
                this.exp_limits.push(cfg.level_definition.character.find(i + 1).exp)
        }
        return e.prototype.show = function (e) {
            Laya.timer.clearAll(this),
                e.is_upgraded ? this.bg_hearts.skin = "myres/sushe/heart_full.png" : this.bg_hearts.skin = "myres/sushe/heart_normal.png",
                this.current_level = e.level,
                this.current_exp_rate = e.exp / this.exp_limits[this.current_level],
                this.isupgrad = e.is_upgraded,
                this.refresh_heart(this.current_level, this.current_exp_rate, e.is_upgraded),
                this.during_change = !1,
                this.preframe_time = Laya.timer.currTimer,
                Laya.timer.frameLoop(1, this, this.update)
        }
            ,
            e.prototype.update = function () {
                var e = Laya.timer.currTimer - this.preframe_time;
                this.preframe_time = Laya.timer.currTimer,
                    this.during_change && (this.target_level != this.current_level ? (this.during_change = !1,
                        this.current_level = this.target_level,
                        this.current_exp_rate = this.target_exp_rate,
                        this.refresh_heart(this.target_level, this.target_exp_rate, this.isupgrad)) : (this.current_exp_rate += e * this.speed,
                            this.target_exp_rate < this.current_exp_rate ? (this.during_change = !1,
                                this.current_level = this.target_level,
                                this.current_exp_rate = this.target_exp_rate,
                                this.refresh_heart(this.target_level, this.target_exp_rate, this.isupgrad)) : this.refresh_heart(this.target_level, this.current_exp_rate, this.isupgrad)))
            }
            ,
            e.prototype.refresh_heart = function (e, t, i) {
                for (var n = 0; n < this.heart_count; n++) {
                    var a = this.heart_masks[n];
                    this.current_level > n ? a.scaleY = 1 : this.current_level == n ? a.scaleY = .82 * t + .1 : a.scaleY = 0,
                        this.hearts[n].getChildByName("v").getChildByName("h").skin = i ? "myres/bothui/heart_gold.png" : "myres/bothui/bf_heart.png"
                }
            }
            ,
            e.prototype.close = function () {
                Laya.timer.clearAll(this)
            }
            ,
            e.prototype.after_give = function (e, t) {
                var i = this
                    , n = e.exp / this.exp_limits[e.level]
                    , a = game.FrontEffect.Inst.create_ui_effect(this.hearts[this.current_level], t ? "scene/effect_heartup_favor.lh" : "scene/effect_heartup.lh", new Laya.Point(0, 0), 1);
                if (Laya.timer.once(2e3, null, function () {
                    a.destory()
                }),
                    e.level > this.current_level) {
                    this.target_level = this.current_level,
                        this.target_exp_rate = 1,
                        this.during_change = !0;
                    var r = (1 - this.current_exp_rate) / this.speed;
                    Laya.timer.once(r + 200, this, function () {
                        var e = game.FrontEffect.Inst.create_ui_effect(i.hearts[i.current_level], "scene/effect_heartlevelup.lh", new Laya.Point(0, 0), 1);
                        Laya.timer.once(2e3, null, function () {
                            e.destory()
                        }),
                            view.AudioMgr.PlayAudio(111)
                    })
                } else
                    e.level == this.current_level && n > this.current_exp_rate ? (this.target_level = e.level,
                        this.target_exp_rate = n,
                        this.during_change = !0) : Laya.timer.once(500, this, function () {
                            i.target_level = e.level,
                                i.target_exp_rate = n,
                                i.during_change = !0
                        })
            }
            ,
            e
    }()
        , i = function () {
            function t(e, t, i) {
                var n = this;
                this.items = [],
                    this.tab_index = 0,
                    this.gift_choose_index = -1,
                    this.content_inshow = !1,
                    this.give_cd = 0,
                    this.sound_channel = null,
                    this.content = e,
                    this.block_exp = i,
                    this.container_tabs = t,
                    this.btn_gift = this.container_tabs.getChildByName("send"),
                    this.btn_gift.clickHandler = Laya.Handler.create(this, function () {
                        2 != n.tab_index && n.change_tab(2)
                    }, null, !1),
                    this.btn_qiyue = this.container_tabs.getChildByName("sign"),
                    this.btn_qiyue.clickHandler = Laya.Handler.create(this, function () {
                        1 != n.tab_index && n.change_tab(1)
                    }, null, !1),
                    this.scrollview = this.content.scriptMap["capsui.CScrollView"],
                    this.scrollview.init_scrollview(Laya.Handler.create(this, this.render_item, null, !1), -1, 4),
                    this.container_qiyue = this.content.getChildByName("page_qiyue"),
                    this.container_gift = this.content.getChildByName("page_gift"),
                    this.content.getChildByName("btn_close").clickHandler = Laya.Handler.create(this, function () {
                        n.change_tab(0)
                    }, null, !1)
            }
            return t.prototype.reset = function () {
                this.content.visible = !1,
                    this.content_inshow = !1,
                    this.tab_index = 0,
                    this.gift_choose_index = -1
            }
                ,
                t.prototype.show = function (e) {
                    this.reset(),
                        this.chara_info = e,
                        this.btn_gift.visible = e.level < 5;
                    var t = cfg.item_definition.character.get(e.charid);
                    this.btn_qiyue.visible = !e.is_upgraded && t.can_marry > 0,
                        game.Tools.child_align_center(this.container_tabs, [7]),
                        this.change_tab(0)
                }
                ,
                t.prototype.change_tab = function (t) {
                    var i = this;
                    if (this.items = [],
                        this.scrollview.reset(),
                        this.container_gift.visible = !1,
                        this.container_qiyue.visible = !1,
                        this.tab_index = t,
                        1 == t) {
                        this.btn_qiyue.getChildByName("chosen").visible = !0,
                            this.btn_qiyue.getChildByName("label").color = "#000000";
                        for (var n = cfg.item_definition.character.get(this.chara_info.charid).star_5_material.split(","), a = !0, r = 0; r < n.length; r++) {
                            var o = n[r].split("-")
                                , s = parseInt(o[0])
                                , h = parseInt(o[1])
                                , c = e.UI_Bag.get_item_count(s);
                            h > c && (a = !1),
                                this.items.push({
                                    id: s,
                                    need: h,
                                    count: c
                                })
                        }
                        if (this.container_qiyue.visible = !0,
                            this.chara_info.level >= 5) {
                            this.container_qiyue.getChildByName("nomet").visible = !1;
                            var p = this.container_qiyue.getChildByName("container_tupo_btn")
                                , u = p.getChildByName("send");
                            u.clickHandler = Laya.Handler.create(this, this._tupo, null, !1),
                                a ? game.Tools.setGrayDisable(u, !1) : game.Tools.setGrayDisable(u, !0),
                                p.visible = !0
                        } else
                            this.container_qiyue.getChildByName("container_tupo_btn").visible = !1,
                                this.container_qiyue.getChildByName("nomet").visible = !0
                    } else
                        this.btn_qiyue.getChildByName("chosen").visible = !1,
                            this.btn_qiyue.getChildByName("label").color = "#cfcdcc";
                    if (2 == t) {
                        this.btn_gift.getChildByName("chosen").visible = !0,
                            this.btn_gift.getChildByName("label").color = "#000000",
                            this.items = e.UI_Bag.find_items_by_category(e.EItemCategory.gift),
                            this.container_gift.visible = !0;
                        this.container_gift.getChildByName("send").clickHandler = Laya.Handler.create(this, this._send_gift, null, !1),
                            this.gift_choose_index = -1,
                            this.refresh_gift_bottom_btns()
                    } else
                        this.btn_gift.getChildByName("chosen").visible = !1,
                            this.btn_gift.getChildByName("label").color = "#cfcdcc",
                            this.sound_channel && (this.sound_channel.stop(),
                                Laya.SoundManager.removeChannel(this.sound_channel),
                                this.sound_channel = null,
                                l.Inst.closechat(!1));
                    this.scrollview.addItem(this.items.length),
                        1 == t || 2 == t ? this.content_inshow || (this.content_inshow = !0,
                            this.content.visible = !0,
                            Laya.Tween.clearAll(this.content),
                            e.UIBase.anim_alpha_in(this.content, {
                                y: -50
                            }, 150, 0, null, Laya.Ease.strongIn)) : this.content_inshow && (this.content_inshow = !1,
                                Laya.Tween.clearAll(this.content),
                                e.UIBase.anim_alpha_out(this.content, {
                                    y: -50
                                }, 150, 0, Laya.Handler.create(this, function () {
                                    i.content.visible = !1
                                }), Laya.Ease.strongIn))
                }
                ,
                t.prototype.render_item = function (e) {
                    var t = e.index
                        , i = e.container;
                    2 == this.tab_index ? this.render_item_gift(t, i) : 1 == this.tab_index && this.render_item_qiyue(t, i)
                }
                ,
                t.prototype.render_item_qiyue = function (t, i) {
                    var n = this.items[t]
                        , a = cfg.item_definition.item.get(n.id);
                    i.getChildByName("name").visible = !1;
                    var r = i.getChildByName("counts");
                    r.visible = !0,
                        r.getChildByName("count_need").text = "/" + n.need.toString();
                    var o = r.getChildByName("count_have");
                    o.text = n.count.toString(),
                        o.color = n.count >= n.need ? "#00ff00" : "#ff0000",
                        game.Tools.child_align_center(r);
                    var s = i.getChildByName("btn");
                    s.clickHandler = Laya.Handler.create(this, function () {
                        e.UI_ItemDetail.Inst.show(n.id)
                    }, null, !1),
                        s.getChildByName("choosed").visible = !1,
                        game.LoadMgr.setImgSkin(s.getChildByName("icon"), a.icon),
                        s.getChildByName("num").visible = !1
                }
                ,
                t.prototype.render_item_gift = function (t, i) {
                    var n = this
                        , a = this.items[t].item_id
                        , r = cfg.item_definition.item.get(a)
                        , o = i.getChildByName("name");
                    o.text = r.name,
                        o.visible = !0,
                        i.getChildByName("counts").visible = !1;
                    var s = i.getChildByName("btn")
                        , h = s.getChildByName("choosed");
                    h.visible = this.gift_choose_index == t,
                        s.clickHandler = Laya.Handler.create(this, function () {
                            if (n.gift_choose_index != t) {
                                var i = n.gift_choose_index;
                                n.gift_choose_index = t,
                                    h.visible = !0,
                                    i >= 0 && i < n.items.length && n.scrollview.wantToRefreshItem(i),
                                    n.refresh_gift_bottom_btns()
                            } else
                                e.UI_ItemDetail.Inst.show(a)
                        }, null, !1),
                        game.LoadMgr.setImgSkin(s.getChildByName("icon"), r.icon);
                    var l = s.getChildByName("num");
                    this.items[t].count > 1 ? (l.text = this.items[t].count.toString(),
                        l.visible = !0) : l.visible = !1
                }
                ,
                t.prototype.refresh_gift_bottom_btns = function () {
                    var t = e.UI_Sushe.send_gift_limit - e.UI_Sushe.send_gift_count;
                    t < 0 && (t = 0),
                        this.container_gift.getChildByName("count").text = t.toString();
                    var i = this.container_gift.getChildByName("send");
                    game.Tools.setGrayDisable(i, 0 == t)
                }
                ,
                t.prototype._tupo = function () {
                    var t = this
                        , i = this.container_qiyue.getChildByName("container_tupo_btn").getChildByName("send");
                    game.Tools.setGrayDisable(i, !0),
                        app.NetAgent.sendReq2Lobby("Lobby", "upgradeCharacter", {
                            character_id: this.chara_info.charid
                        }, function (n, a) {
                            n || a.error ? (e.UIMgr.Inst.showNetReqError("upgradeCharacter", n, a),
                                game.Tools.setGrayDisable(i, !1)) : (l.Inst.close(),
                                    Laya.timer.once(150, t, function () {
                                        t.chara_info.is_upgraded = !0,
                                            e.UI_Character_star_up.Inst.show(t.chara_info, Laya.Handler.create(t, function () {
                                                e.UI_Sushe.Inst.starup_back()
                                            }))
                                    }))
                        })
                }
                ,
                t.prototype.close_audio = function () {
                    this.sound_channel && (this.sound_channel.stop(),
                        Laya.SoundManager.removeChannel(this.sound_channel),
                        this.sound_channel = null,
                        l.Inst.closechat(!1))
                }
                ,
                t.prototype._send_gift = function () {
                    var t = this;
                    if (!(this.gift_choose_index < 0 || this.gift_choose_index >= this.items.length || Laya.timer.currTimer < this.give_cd)) {
                        this.give_cd = Laya.timer.currTimer + 1e4;
                        var i = this.container_gift.getChildByName("send");
                        game.Tools.setGrayDisable(i, !0);
                        var n = this.chara_info.charid
                            , a = this.items[this.gift_choose_index].item_id;
                        app.NetAgent.sendReq2Lobby("Lobby", "sendGiftToCharacter", {
                            character_id: n,
                            gifts: [{
                                item_id: a,
                                count: 1
                            }]
                        }, function (r, o) {
                            if (r || o.error)
                                game.Tools.setGrayDisable(i, !1),
                                    t.give_cd = 0,
                                    e.UIMgr.Inst.showNetReqError("sendGiftToCharacter", r, o);
                            else {
                                if (app.Log.log("sendGiftToCharacter: " + JSON.stringify(o)),
                                    t.chara_info.charid == n) {
                                    if (2 == t.tab_index)
                                        for (_ = 0; _ < t.items.length; _++)
                                            if (t.items[_].item_id == a) {
                                                if (t.items[_].count <= 1) {
                                                    for (var s = _; s < t.items.length - 1; s++)
                                                        t.items[s] = t.items[s + 1];
                                                    t.items.pop(),
                                                        t.gift_choose_index = -1,
                                                        t.scrollview.reset(),
                                                        t.scrollview.addItem(t.items.length)
                                                } else
                                                    t.items[_].count-- ,
                                                        t.scrollview.wantToRefreshItem(_);
                                                break
                                            }
                                    var h = cfg.item_definition.item.get(a).type == cfg.item_definition.character.get(n).favorite;
                                    if (o.level > t.block_exp.current_level) {
                                        l.Inst.locking = !0;
                                        var c = (1 - t.block_exp.current_exp_rate) / t.block_exp.speed;
                                        t.block_exp.after_give(o, h),
                                            Laya.timer.once(c + 600, t, function () {
                                                t.chara_info.level = o.level,
                                                    t.chara_info.exp = o.exp,
                                                    e.UI_Character_star_up.Inst.show(t.chara_info, Laya.Handler.create(t, function () {
                                                        e.UI_Sushe.Inst.starup_back()
                                                    })),
                                                    Laya.timer.once(600, t, function () {
                                                        l.Inst.close()
                                                    }),
                                                    t.give_cd = 0
                                            });
                                        for (_ = 0; _ < 4; _++) {
                                            var p = 50 * (_ + 1);
                                            Laya.timer.once(p + c + 600, t, function () {
                                                t.sound_channel && (t.sound_channel.volume *= .5)
                                            })
                                        }
                                    } else {
                                        if (t.block_exp.after_give(o, h),
                                            t.give_cd = 0,
                                            game.Tools.setGrayDisable(i, !1),
                                            !t.sound_channel) {
                                            var u = "";
                                            u = cfg.item_definition.character.get(n).favorite == cfg.item_definition.item.get(a).type ? "lobby_gift_favor" : "lobby_gift";
                                            var d = view.AudioMgr.PlayCharactorSound(t.chara_info, u, Laya.Handler.create(t, function () {
                                                t.sound_channel = null,
                                                    l.Inst.closechat(!1)
                                            }));
                                            l.Inst.chat(d.words),
                                                t.sound_channel = d.sound,
                                                e.UI_Sushe.Inst.stopsay()
                                        }
                                        t.chara_info.exp = o.exp
                                    }
                                } else {
                                    for (var _ = 0; _ < e.UI_Sushe.characters.length; _++)
                                        if (e.UI_Sushe.characters[_].charid == n) {
                                            e.UI_Sushe.characters[_].level = o.level,
                                                e.UI_Sushe.characters[_].exp = o.exp;
                                            break
                                        }
                                    t.give_cd = 0
                                }
                                e.UI_Sushe.send_gift_count++ ,
                                    t.refresh_gift_bottom_btns()
                            }
                        })
                    }
                }
                ,
                t
        }()
        , n = function () {
            function n(n) {
                var a = this;
                this.head = null,
                    this.emos = [],
                    this._scrollbar = null,
                    this._scrollpoint = null,
                    this._drag_scroll = !1,
                    this.me = n,
                    this.me.visible = !1,
                    this.block_exp = new t(n.getChildByName("container_heart")),
                    this.block_gift = new i(n.getChildByName("container_gift"), n.getChildByName("tabs"), this.block_exp),
                    this.container_intro = n.getChildByName("intro"),
                    this.content = this.container_intro.getChildByName("content"),
                    this.content.vScrollBarSkin = "",
                    this.head = new e.UI_Character_Skin(this.container_intro.getChildByName("content").getChildByName("container_head").getChildByName("head"));
                var r = this.content.getChildByName("container_emj").getChildByName("container").getChildByName("emo_templete");
                r.visible = !1;
                for (var o = 0; o < 9; o++)
                    this.emos.push(new e.UI_Character_Emo(r.scriptMap["capsui.UICopy"].getNodeClone())),
                        this.emos[o].me.x = o % 4 * 184,
                        this.emos[o].me.y = 184 * Math.floor(o / 4);
                this.content.getChildByName("container_emj").height = 652,
                    this.content.getChildByName("container_head").getChildByName("btn_skin").clickHandler = Laya.Handler.create(this, function () {
                        l.Inst.open_skin(Laya.Handler.create(a, a.change_skin))
                    }, null, !1),
                    this._scrollbar = this.container_intro.getChildByName("scrollbar"),
                    this._scrollpoint = this._scrollbar.getChildByName("scrollpoint"),
                    this._scrollbar && (this._scrollbar.on("mousedown", this, function () {
                        a._drag_scroll = !0;
                        var e = a._scrollbar.mouseY / a._scrollbar.height;
                        a.content.vScrollBar.value = a.content.vScrollBar.max * e
                    }),
                        this._scrollbar.on("mousemove", this, function () {
                            if (a._drag_scroll) {
                                var e = a._scrollbar.mouseY / a._scrollbar.height;
                                a.content.vScrollBar.value = a.content.vScrollBar.max * e
                            }
                        }),
                        this._scrollbar.on("mouseup", this, function () {
                            a._drag_scroll = !1
                        }),
                        this._scrollbar.on("mouseout", this, function () {
                            a._drag_scroll = !1
                        }),
                        this.content.vScrollBar.on("change", this, function () {
                            var e = a.content.vScrollBar.value / a.content.vScrollBar.max;
                            a._scrollpoint.y = a._scrollbar.height * e
                        }))
            }
            return n.prototype.show = function (e) {
                var t = this.content.getChildByName("container_text")
                    , i = cfg.item_definition.character.get(e.charid);
                t.getChildByName("height").text = i.desc_stature,
                    t.getChildByName("birth").text = i.desc_birth,
                    t.getChildByName("age").text = i.desc_age,
                    t.getChildByName("bloodtype").text = i.desc_bloodtype,
                    t.getChildByName("cv").text = i.desc_cv,
                    t.getChildByName("hobby").text = i.desc_hobby,
                    t.getChildByName("desc").text = i.desc,
                    this.head.setSkin(e.skin, "smallhead");
                this.content.getChildByName("container_emj").y = t.getChildByName("desc").textField.textHeight + 561 - 194;
                for (var n = 0; n < this.emos.length; n++)
                    this.emos[n].setSkin(e.charid, n),
                        this.emos[n].me.getChildByName("lock").visible = !1;
                this.content.refresh(),
                    this._drag_scroll = !1,
                    this.block_exp.show(e),
                    this.block_gift.show(e),
                    this.me.visible = !0
            }
                ,
                n.prototype.change_skin = function (t) {
                    e.UI_Sushe.Inst.onChangeSkin(t),
                        this.head.setSkin(t, "smallhead")
                }
                ,
                n.prototype.close = function () {
                    this.me.visible = !1
                }
                ,
                n
        }()
        , a = function () {
            function e(e) {
                var t = this;
                this.solts = [1, 2, 3],
                    this.solt_btns = [],
                    this.chara_info = null,
                    this.me = e,
                    this.me.visible = !1;
                for (var i = function (e) {
                    var i = n.me.getChildByName("slot" + e);
                    n.solt_btns.push(i),
                        i.clickHandler = Laya.Handler.create(n, function () {
                            l.Inst.pop_effect_choose(1 + e, Laya.Handler.create(t, function (i) {
                                t.on_change_view(1 + e, i)
                            }))
                        }, null, !1)
                }, n = this, a = 0; a < 3; a++)
                    i(a)
            }
            return e.prototype.render_item = function (e) {
                var t = this.solts[e]
                    , i = -1;
                if (this.chara_info.views)
                    for (var n = 0; n < this.chara_info.views.length; n++)
                        if (this.chara_info.views[n].slot == t) {
                            i = this.chara_info.views[n].item_id;
                            break
                        }
                var a = this.solt_btns[e];
                -1 == i || 0 == i ? (a.getChildByName("icon").skin = "myres/sushe/bf_frame_anime.png",
                    a.getChildByName("plus").visible = !0,
                    a.getChildByName("desc").text = cfg.str.str.get(411 + e).desc) : (game.LoadMgr.setImgSkin(a.getChildByName("icon"), cfg.item_definition.item.get(i).icon),
                        a.getChildByName("plus").visible = !1,
                        a.getChildByName("desc").text = cfg.item_definition.item.get(i).desc)
            }
                ,
                e.prototype.on_change_view = function (e, t) {
                    var i = !1;
                    if (this.chara_info.views)
                        for (n = 0; n < this.chara_info.views.length; n++)
                            if (this.chara_info.views[n].slot == e) {
                                i = !0,
                                    this.chara_info.views[n].item_id == t ? (this.chara_info.views[n].item_id = 0,
                                        t = 0) : this.chara_info.views[n].item_id = t;
                                break
                            }
                    i || (this.chara_info.views || (this.chara_info.views = []),
                        this.chara_info.views.push({
                            slot: e,
                            item_id: t
                        })),
                        app.NetAgent.sendReq2Lobby("Lobby", "changeCharacterView", {
                            character_id: this.chara_info.charid,
                            slot: e,
                            item_id: t
                        }, function (e, t) { });
                    for (var n = 0; n < this.solts.length; n++)
                        this.render_item(n)
                }
                ,
                e.prototype.show = function (e) {
                    this.chara_info = e;
                    for (var t = 0; t < 3; t++)
                        this.render_item(t);
                    this.me.visible = !0
                }
                ,
                e.prototype.close = function () {
                    this.me.visible = !1
                }
                ,
                e
        }()
        , r = function () {
            function t(e) {
                this.sounds = [],
                    this.chara_info = null,
                    this.current_play_index = -1,
                    this.current_soundchannel = null,
                    this.volume_fixed = 0,
                    this.me = e,
                    this.me.visible = !1,
                    this.scrollview = this.me.scriptMap["capsui.CScrollView"],
                    this.scrollview.init_scrollview(Laya.Handler.create(this, this.render_item, null, !1))
            }
            return t.prototype.show = function (t) {
                this.chara_info = t,
                    this.sounds = [];
                for (var i = cfg.voice.sound.getGroup(cfg.item_definition.character.get(t.charid).sound), n = 0; n < i.length; n++)
                    this.sounds.push(i[n]);
                this.volume_fixed = cfg.item_definition.character.get(t.charid).sound_volume,
                    this.scrollview.reset(),
                    this.scrollview.addItem(this.sounds.length),
                    this.me.visible = !0,
                    view.AudioMgr.refresh_music_volume(!0),
                    this.current_play_index = -1,
                    e.UI_Sushe.Inst.stopsay()
            }
                ,
                t.prototype.close = function () {
                    this.me.visible && (this.me.visible = !1,
                        view.AudioMgr.refresh_music_volume(!1),
                        this.current_soundchannel && (this.current_soundchannel.stop(),
                            Laya.SoundManager.removeChannel(this.current_soundchannel),
                            this.current_soundchannel = null,
                            this.current_play_index = -1,
                            l.Inst.closechat(!1)))
                }
                ,
                t.prototype.render_item = function (e) {
                    var t = this
                        , i = e.index
                        , n = e.container
                        , a = this.sounds[i];
                    n.getChildByName("desc").text = a.name;
                    var r = n.getChildByName("btn_play")
                        , o = r.getChildByName("img");
                    o.skin = this.current_play_index == i ? "myres/sushe/bf_pause.png" : "myres/sushe/bf_play.png",
                        r.clickHandler = Laya.Handler.create(this, function () {
                            if (t.current_play_index == i)
                                t.current_soundchannel && (t.current_soundchannel.stop(),
                                    Laya.SoundManager.removeChannel(t.current_soundchannel),
                                    t.current_soundchannel = null),
                                    l.Inst.closechat(!1),
                                    o.skin = "myres/sushe/bf_play.png",
                                    t.current_play_index = -1;
                            else {
                                var e = t.current_play_index;
                                t.current_play_index = i,
                                    e >= 0 && e < t.sounds.length && t.scrollview.wantToRefreshItem(e),
                                    t.current_soundchannel && (Laya.SoundManager.removeChannel(t.current_soundchannel),
                                        t.current_soundchannel.stop(),
                                        t.current_soundchannel = null),
                                    o.skin = "myres/sushe/bf_pause.png",
                                    t.current_soundchannel = Laya.SoundManager.playSound(a.path + view.AudioMgr.suffix, 1, new Laya.Handler(t, function () {
                                        if (t.current_soundchannel) {
                                            t.current_soundchannel = null;
                                            var e = t.current_play_index;
                                            t.current_play_index = -1,
                                                e >= 0 && e < t.sounds.length && t.scrollview.wantToRefreshItem(e),
                                                l.Inst.closechat(!1)
                                        }
                                    }
                                    )),
                                    t.current_soundchannel.volume = view.AudioMgr.soundMuted ? 0 : view.AudioMgr.soundVolume * t.volume_fixed,
                                    l.Inst.chat(a.words)
                            }
                        }, null, !1);
                    var s = n.getChildByName("lock");
                    this.chara_info.level >= a.level_limit ? (s.visible = !1,
                        r.visible = !0) : (s.visible = !0,
                            r.visible = !1,
                            s.getChildByName("info").text = "羁绊lv" + a.level_limit + "解锁")
                }
                ,
                t
        }()
        , o = function () {
            function t(e) {
                var t = this;
                this.items = [],
                    this.current_using_item_id = -1,
                    this.me = e,
                    this.root = e.getChildByName("root"),
                    this.title = this.root.getChildByName("title"),
                    this.root.getChildByName("btn_close").clickHandler = Laya.Handler.create(this, function () {
                        t.close()
                    }, null, !1),
                    this.scrollview = this.root.scriptMap["capsui.CScrollView"],
                    this.scrollview.init_scrollview(Laya.Handler.create(this, this.render_item, null, !1), -1, 3)
            }
            return t.prototype.show = function (t, i, n) {
                this.me.visible = !0,
                    this.root.scaleX = this.root.scaleY = 1,
                    e.UIBase.anim_pop_out(this.root, null),
                    this.chara_info = t,
                    this.slot_id = i,
                    this.when_change = n,
                    this.items = [];
                for (var a = e.UI_Bag.find_items_by_category(e.EItemCategory.character_view), r = 0; r < a.length; r++) {
                    cfg.item_definition.item.get(a[r].item_id).type == i && this.items.push(a[r].item_id)
                }
                if (this.current_using_item_id = -1,
                    t.views)
                    for (r = 0; r < t.views.length; r++)
                        if (t.views[r].slot == this.slot_id) {
                            this.current_using_item_id = t.views[r].item_id;
                            break
                        }
                switch (this.title.text = "",
                i) {
                    case 1:
                        this.title.text = "立直棒";
                        break;
                    case 2:
                        this.title.text = "和牌特效";
                        break;
                    case 3:
                        this.title.text = "立直特效"
                }
                this.root.getChildByName("no_info").visible = 0 == this.items.length,
                    this.scrollview.reset(),
                    this.scrollview.addItem(this.items.length)
            }
                ,
                t.prototype.close = function () {
                    var t = this;
                    this.when_change = null,
                        e.UIBase.anim_pop_hide(this.root, Laya.Handler.create(this, function () {
                            t.me.visible = !1
                        }))
                }
                ,
                t.prototype.render_item = function (t) {
                    var i = this
                        , n = t.index
                        , a = t.container
                        , r = t.cache_data
                        , o = a.getChildByName("btn");
                    o.clickHandler = Laya.Handler.create(this, function () {
                        i.when_change && i.when_change.runWith(i.items[n]),
                            i.close()
                    }, null, !1),
                        r.icon || (r.icon = new e.UI_Item_Skin(o.getChildByName("icon"))),
                        r.icon.setSkin(cfg.item_definition.item.get(this.items[n]).icon);
                    a.getChildByName("using").visible = this.current_using_item_id == this.items[n]
                }
                ,
                t
        }()
        , s = function () {
            function t(e) {
                var t = this;
                this.skins = [],
                    this.me = e,
                    this.root = e.getChildByName("root"),
                    this.root.getChildByName("btn_close").clickHandler = Laya.Handler.create(this, function () {
                        t.close()
                    }, null, !1),
                    this.scrollview = this.root.scriptMap["capsui.CScrollView"],
                    this.scrollview.init_scrollview(Laya.Handler.create(this, this.render_item, null, !1), -1, 3)
            }
            return t.prototype.show = function (t, i) {
                this.me.visible = !0,
                    e.UIBase.anim_pop_out(this.root, null),
                    this.chara_info = t,
                    this.when_change = i,
                    this.skins = [];
                var n = cfg.item_definition.character.get(t.charid);
                if (this.skins.push(n.init_skin),
                    n.can_marry && this.skins.push(n.full_fetter_skin),
                    n.skin_lib)
                    for (var a = 0; a < n.skin_lib.length; a++)
                        n.skin_lib[a] && this.skins.push(n.skin_lib[a]);
                this.scrollview.reset(),
                    this.scrollview.addItem(this.skins.length)
            }
                ,
                t.prototype.close = function () {
                    var t = this;
                    this.when_change = null,
                        e.UIBase.anim_pop_hide(this.root, Laya.Handler.create(this, function () {
                            t.me.visible = !1
                        }))
                }
                ,
                t.prototype.render_item = function (t) {
                    var i = this
                        , n = t.index
                        , a = t.container
                        , r = t.cache_data
                        , o = a.getChildByName("btn");
                    r.skin || (r.skin = new e.UI_Character_Skin(o.getChildByName("icon")));
                    a.getChildByName("using").visible = this.skins[n] == this.chara_info.skin;
                    var s = cfg.item_definition.skin.get(this.skins[n]);
                    r.skin.setSkin(this.skins[n], "smallhead");
                    var h = o.getChildByName("locked");
                    e.UI_Sushe.skin_owned(this.skins[n]) ? (h.visible = !1,
                        o.clickHandler = Laya.Handler.create(this, function () {
                            i.skins[n] != i.chara_info.skin && i.when_change && i.when_change.runWith(i.skins[n]),
                                i.close()
                        }, null, !1)) : (h.visible = !0,
                            h.getChildByName("info").text = s.lock_tips,
                            o.clickHandler = null)
                }
                ,
                t
        }()
        , h = function () {
            function e(e) {
                var t = this;
                this.locking = !1,
                    this.me = e,
                    this.info = this.me.getChildByName("info"),
                    this.me.on("mousedown", this, function () {
                        t.locking || t.close()
                    })
            }
            return e.prototype.show = function (e) {
                var t = this;
                this.info.text = e,
                    this.me.height = 120 + this.info.textField.textHeight,
                    this.me.visible = !0,
                    this.locking = !0,
                    this.me.scaleY = 0,
                    Laya.timer.clearAll(this),
                    Laya.Tween.to(this.me, {
                        scaleY: 1
                    }, 150, null, Laya.Handler.create(this, function () {
                        t.locking = !1
                    })),
                    Laya.timer.once(3e3, this, function () {
                        t.close()
                    })
            }
                ,
                e.prototype.close = function () {
                    var e = this;
                    this.locking = !0,
                        Laya.timer.clearAll(this),
                        Laya.Tween.to(this.me, {
                            scaleY: 0
                        }, 150, null, Laya.Handler.create(this, function () {
                            e.locking = !1,
                                e.me.visible = !1
                        }))
                }
                ,
                e
        }()
        , l = function (t) {
            function i() {
                var e = t.call(this, new ui.lobby.visitUI) || this;
                return e.tabs = [],
                    e.page_intro = null,
                    e.page_effect = null,
                    e.page_sound = null,
                    e.block_chat = null,
                    e.pop_effect = null,
                    e.pop_skin = null,
                    e.locking = !1,
                    e.current_page = -1,
                    e.chara_info = null,
                    i.Inst = e,
                    e
            }
            return __extends(i, t),
                Object.defineProperty(i.prototype, "cannot_click_say", {
                    get: function () {
                        return 1 == this.current_page || null != this.page_intro.block_gift.sound_channel
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                i.prototype.onCreate = function () {
                    var t = this;
                    this.container_top = this.me.getChildByName("top"),
                        this.container_top.getChildByName("btn_back").clickHandler = Laya.Handler.create(this, function () {
                            t.locking || t.back2select()
                        }, null, !1),
                        this.container_right = this.me.getChildByName("right");
                    for (var i = function (e) {
                        l.tabs.push(l.container_right.getChildByName("btn_page" + e)),
                            l.tabs[e].clickHandler = Laya.Handler.create(l, function () {
                                t.locking || t.current_page != e && t.change_page(e)
                            }, null, !1)
                    }, l = this, c = 0; c < 3; c++)
                        i(c);
                    this.page_intro = new n(this.container_right.getChildByName("page_intro")),
                        this.page_effect = new a(this.container_right.getChildByName("effect")),
                        this.page_sound = new r(this.container_right.getChildByName("sound")),
                        this.block_chat = new e.UI_Character_Chat(this.me.getChildByName("chat")),
                        this.block_chat.me.visible = !1,
                        this.pop_effect = new o(this.me.getChildByName("pop_effect")),
                        this.pop_skin = new s(this.me.getChildByName("pop_skin")),
                        this.info_levelup = new h(this.me.getChildByName("levelup"))
                }
                ,
                i.prototype.show = function (t, i) {
                    var n = this;
                    this.chara_info = t;
                    for (var a = 0; a < this.tabs.length; a++)
                        this.tabs[a].skin = "myres/sushe/bf_unchooesd.png";
                    this.page_intro.close(),
                        this.page_effect.close(),
                        this.page_sound.close(),
                        this.current_page = -1,
                        this.change_page(0),
                        this.block_chat.me.visible = !1,
                        this.pop_effect.me.visible = !1,
                        this.pop_skin.me.visible = !1,
                        this.info_levelup.me.visible = !1,
                        this.me.visible = !0,
                        this.locking = !0,
                        e.UIBase.anim_alpha_in(this.container_top, {
                            y: -30
                        }, 150),
                        e.UIBase.anim_alpha_in(this.container_right, {
                            x: 30
                        }, 150),
                        e.UIBase.anim_alpha_in(this.block_chat.me, {
                            y: 30
                        }, 150),
                        Laya.timer.once(150, this, function () {
                            n.locking = !1
                        }),
                        i && Laya.timer.once(150, this, function () {
                            n.chara_info.is_upgraded ? n.info_levelup.show("获得了新的形象") : n.info_levelup.show(cfg.level_definition.character.get(n.chara_info.level).unlock_desc)
                        })
                }
                ,
                i.prototype.close = function () {
                    var t = this;
                    this.locking = !0,
                        e.UIBase.anim_alpha_out(this.container_top, {
                            y: -30
                        }, 150),
                        e.UIBase.anim_alpha_out(this.container_right, {
                            x: 30
                        }, 150),
                        e.UIBase.anim_alpha_out(this.block_chat.me, {
                            y: 30
                        }, 150),
                        Laya.timer.once(150, this, function () {
                            t.locking = !1,
                                t.me.visible = !1,
                                t.page_sound.me.visible && t.page_sound.close(),
                                t.page_intro.block_gift.close_audio()
                        })
                }
                ,
                i.prototype.back2select = function () {
                    this.close(),
                        Laya.timer.once(150, this, function () {
                            e.UI_Sushe.Inst.show_page_select()
                        })
                }
                ,
                i.prototype.change_page = function (e) {
                    if (this.current_page >= 0)
                        switch (this.tabs[this.current_page].skin = "myres/sushe/bf_unchooesd.png",
                        this.current_page) {
                            case 0:
                                this.page_intro.close();
                                break;
                            case 1:
                                this.page_sound.close();
                                break;
                            case 2:
                                this.page_effect.close()
                        }
                    if (this.current_page = e,
                        this.current_page >= 0)
                        switch (this.tabs[this.current_page].skin = "myres/sushe/bf_chosen.png",
                        this.current_page) {
                            case 0:
                                this.page_intro.show(this.chara_info);
                                break;
                            case 1:
                                this.page_sound.show(this.chara_info);
                                break;
                            case 2:
                                this.page_effect.show(this.chara_info)
                        }
                }
                ,
                i.prototype.open_skin = function (e) {
                    this.pop_skin.show(this.chara_info, e)
                }
                ,
                i.prototype.pop_effect_choose = function (e, t) {
                    this.pop_effect.show(this.chara_info, e, t)
                }
                ,
                i.prototype.chat = function (e) {
                    this.block_chat.show(e)
                }
                ,
                i.prototype.closechat = function (e) {
                    this.block_chat.close(e)
                }
                ,
                i
        }(e.UIBase);
    e.UI_Sushe_Visit = l
}(uiscript || (uiscript = {}));