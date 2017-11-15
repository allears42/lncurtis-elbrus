var query1 = {}, query2 = {};
for (var i = 0; i < xxs_on_arr.length; i++) {
	var args1 = xxs_on_arr[i] && xxs_on_arr[i].split("=")
		, args2 = xxs_off_arr[i] && xxs_off_arr[i].split("=")
		, result = {};
	
	
	if (args1 && args1.length) {
		
		query1[args1[0]] = args1[1];
		
	}
	if (args2 && args2.length) {
		
		query2[args2[0]] = args2[1];
		
	}
}

difference = {};

for (var key in query1) {
	if (!query2.hasOwnProperty(key)) difference[key] = query1[key];
	
	
}

diff = {
	"calculatepromotionbuttonfield": "%3Cspan+class%3D%27button_inline%27+style%3D%27position%3Arelative%3Bvertical-align%3A+top%27%3E%3Ctable+id%3D%27tbl_calculatepromotion%27+cellpadding%3D%270%27+cellspacing%3D%270%27+border%3D%270%27+class%3D%27uir-button%27+style%3D%27margin-right%3A6px%3B%27+role%3D%27presentation%27%3E+%3Ctr+id%3D%27tr_calculatepromotion%27+class%3D%27tabBntDis%27%3E+%3Ctd+id%3D%27tdleftcap_calculatepromotion%27%3E%3Cimg+src%3D%27%2Fimages%2Fnav%2Fns_x.gif%27+class%3D%27bntLT%27+border%3D%270%27+height%3D%2750%25%27+width%3D%2710%27+alt%3D%27%27%2F%3E+%3Cimg+src%3D%27%2Fimages%2Fnav%2Fns_x.gif%27+class%3D%27bntLB%27+border%3D%270%27+height%3D%2750%25%27+width%3D%2710%27+alt%3D%27%27%2F%3E+%3C%2Ftd%3E+%3Ctd+id%3D%27tdbody_calculatepromotion%27+height%3D%2720%27+valign%3D%27top%27+nowrap+class%3D%27bntBgB%27%3E+%3Cinput+type%3D%27button%27+style%3D%27%27+class%3D%27rndbuttoninpt+bntBgT%27+value%3D%27Calculate%27+id%3D%27calculatepromotion%27+name%3D%27calculatepromotion%27+disabled+onclick%3D%22om.promotions.runPromotionEngine%28%27btnCalculate%27%29%3B+return+false%3B%22+onmousedown%3D%22this.setAttribute%28%27_mousedown%27%2C%27T%27%29%3B+setButtonDown%28true%2C+false%2C+this%29%3B%22+onmouseup%3D%22this.setAttribute%28%27_mousedown%27%2C%27F%27%29%3B+setButtonDown%28false%2C+false%2C+this%29%3B%22+onmouseout%3D%22if%28this.getAttribute%28%27_mousedown%27%29%3D%3D%27T%27%29+setButtonDown%28false%2C+false%2C+this%29%3B%22+onmouseover%3D%22if%28this.getAttribute%28%27_mousedown%27%29%3D%3D%27T%27%29+setButtonDown%28true%2C+false%2C+this%29%3B%22+%3E%3C%2Ftd%3E+%3Ctd+id%3D%27tdrightcap_calculatepromotion%27%3E+%3Cimg+src%3D%27%2Fimages%2Fnav%2Fns_x.gif%27+height%3D%2750%25%27+class%3D%27bntRT%27+border%3D%270%27+width%3D%2710%27+alt%3D%27%27%3E+%3Cimg+src%3D%27%2Fimages%2Fnav%2Fns_x.gif%27+height%3D%2750%25%27+class%3D%27bntRB%27+border%3D%270%27+width%3D%2710%27+alt%3D%27%27%3E+%3C%2Ftd%3E+%3C%2Ftr%3E+%3C%2Ftable%3E%3C%2Fspan%3E",
	"orderleveldata": "%5B%5D",
	"discounttax1amountdata": "",
	"discounttax2amountdata": "",
	"promotionids": "",
	"promotionsfields": "muccpromocodeinstance%01promocode_display%01promocode%01applicabilitystatus%01applicabilityreason%01applicabilitymode%01applicabilitystatusinformation%01couponcode_display%01couponcode%01discount%01discountrate%01isorderleveldiscount%01discountistaxable%01cannotbecombined%01isnewpromotiontype%01legacypromodiscountbasis%01legacypromodiscounttaxbasis%01legacypromodiscounttax2basis%01orderleveldiscountasbasis%01promotionisvalid%01promotioncodeerror%01purchasediscount%01shippingdiscount%01discountingshippingmethodid",
	"promotionsflags": "0%018%011%010%010%010%010%018%011%010%010%010%010%010%010%010%010%010%010%010%010%010%010%010",
	"promotionsfieldsets": "%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01",
	"promotionstypes": "text%01text%01integer%01select%01text%01text%01summary%01text%01integer%01select%01rate%01text%01text%01text%01text%01text%01text%01text%01text%01text%01text%01rtext%01rtext%01text",
	"promotionsparents": "promotions.promocode%01entity%01entity%01%01%01%01%01entity%01entity%01promotions.promocode%01promotions.promocode%01promotions.promocode%01promotions.promocode%01promotions.promocode%01promotions.promocode%01%01%01%01%01%01%01%01%01promotions.promocode",
	"promotionsloaded": "F",
	"promotionslabels": "%01Promotion%01%01Status%01%01%01Status+Information%01Coupon+Code%01%01Discount+Item%01Rate%01%01%01%01%01%01%01%01%01%01%01Purchase+Discount%01Shipping+Discount%01",
	"promotionsdata": "",
	"nextpromotionsidx": "1",
	"promotionsvalid": "T"
}