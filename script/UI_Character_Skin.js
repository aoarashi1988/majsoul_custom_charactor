!function (e) {
    var t = function () {
        function t(t) {
            this.change_id = 0,
                this.skin_path = "",
                this.loaded = !1,
                this.me = t,
                this.img = t,
                this.origin_rect = e.UIRect.CreateFromSprite(this.img),
                this.img.skin = ""
        }
        return t.prototype.setSkin = function (skin_id, skin_type) {
            var _this = this
                , skin = cfg.item_definition.skin.get(skin_id);
            if (skin) {
                var a = skin.path + "/" + skin_type + ".png";
                if (a != this.skin_path) {
                    this.skin_path = a,
                        this.change_id++;
                    var r = this.change_id;
                    "" == game.LoadMgr.getResImageSkin(a) ? (this._setLoadedTexture(4e5, skin_type),
                        this.loaded = !1,
                        game.LoadMgr.loadResImage([this.skin_path], Laya.Handler.create(this, function () {
                            r == _this.change_id && (_this.loaded = !0,
                                _this._setLoadedTexture(skin_id, skin_type))
                        }))) : (this.loaded = !0,
                            this._setLoadedTexture(skin_id, skin_type))
                }
            } else
                this.clear()
        }
            ,
            t.prototype.clear = function () {
                this.change_id++ ,
                    this.loaded && "" != this.skin_path && (this.loaded = !1,
                        this.skin_path = "")
            }
            ,
            t.prototype._setLoadedTexture = function (e, t) {
                var i = cfg.item_definition.skin.get(e);
                "full" == t || "half" == t ? game.Tools.charaPart(e, this.img, t, this.origin_rect) : this.img.skin = game.LoadMgr.getResImageSkin(i.path + "/" + t + ".png")
            }
            ,
            t
    }();
    e.UI_Character_Skin = t
}(uiscript || (uiscript = {}));