import {JetView, plugins} from "webix-jet";



export default class TopView extends JetView{
	config(){
		var header = {
			type:"header", template:this.app.config.name, css:"webix_header app_header"
		};

		var menu = {
			view:"menu", id:"top:menu", 
			css:"app_menu",
			width:280, layout:"y", select:true,
			template:"<span class='webix_icon #icon#'></span> #value# ",
			data:[
				{ value:"Dashboard", id:"start", icon:"wxi-columns" },
				{ value:"Data",		 id:"data",  icon:"wxi-pencil" },
				{ value:"Pasien", id:"pasien", icon:"wxi-pencil"},
				{ value:"Poli", id:"poli", icon:"wxi-pencil"},
				{ value:"Dokter", id:"dokter", icon:"wxi-pencil"},
				{ value:"Diagnosa", id:"diagnosa", icon:"wxi-pencil"},
				{ value:"Rawat Jalan", id:"rawat_jalan", icon:"wxi-pencil"},
				{ value:"Transaksi Periksa", id:"transaksi_periksa", icon:"wxi-pencil"},
				{ value:"Tindakan Medis", id:"tindakan_medis", icon:"wxi-pencil"},
				{ value:"Transaksi Periksa Detail", id:"transaksi_periksa_detail", icon:"wxi-pencil"},
				{ value:"Jenis Penunjang", id:"jenis_penunjang", icon:"wxi-pencil"},
				{ value:"Transaksi Penunjang", id:"transaksi_penunjang", icon:"wxi-pencil"},
				{ value:"Transaksi Penunjang Detail", id:"transaksi_penunjang_detail", icon:"wxi-pencil"},
				{ value:"Obat", id:"obat", icon:"wxi-pencil"},
				{ value:"Transaksi Obat", id:"transaksi_obat", icon:"wxi-pencil"},
				{ value:"Transaksi Obat Detail", id:"transaksi_obat_detail", icon:"wxi-pencil"},
				{ value:"Transaksi Bayar", id:"transaksi_bayar", icon:"wxi-pencil"},
				{ value:"Transaksi Bayar Detail", id:"transaksi_bayar_detail", icon:"wxi-pencil"},
			]
		};

		var ui = {
			type:"clean", paddingX:5, css:"app_layout", cols:[
				{  paddingX:5, paddingY:10, rows: [ {css:"webix_shadow_medium", rows:[header, menu]} ]},
				{ type:"wide", paddingY:10, paddingX:5, rows:[
					{ $subview:true } 
				]}
			]
		};

		return ui;
	}
	init(){
		this.use(plugins.Menu, "top:menu");
	}
}