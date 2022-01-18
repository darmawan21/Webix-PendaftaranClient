/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { JetView } from "webix-jet";    

export default class TransaksiObatDetail extends JetView {
	config(){
		var ui = {rows: [
			{ view:"template", template:"Data Transaksi Obat Detail", type:"header" },
			{
				view:"toolbar", paddingY:2,
				cols:[
					{ view:"button", click:()=>this.tambahTransaksiObatDetail(), label:"Tambah", type:"iconButton", icon:"fa fa-plus", width:100 },
					{ view:"button", click:()=>this.refreshTransaksiObatDetail(), label:"Refresh", type:"iconButton", icon:"fa fa-sync", width:100 },
					{ view:"button", click:()=>this.cetakTagihanPdf(), label:"Cetak Tagihan", type:"iconButton", width:200 },
					{ template:"", borderless:true },
					{ view:"button", click:()=>this.ubahTransaksiObatDetail(), label:"Ubah", type:"iconButton", icon:"fa fa-edit", width:100 },
					{ view:"button", click:()=>this.hapusTransaksiObatDetail(), label:"Hapus", type:"iconButton", icon:"fa fa-trash-alt", width:100 },
				]
			},
			{
				view:"datatable",
				select: true,
				id:"tabelTransaksiObatDetail",
				columns: [
					{ id:"id_transaksi_obat", header:["Transaksi Obat",{content:"textFilter"}], width:100 },
					{ id:"nama_obat", header:["Nama Obat",{content:"textFilter"}], width:100 },
					{ id:"harga_obat", header:["Harga Obat",{content:"textFilter"}], width:100 },
					{ id:"jumlah", header:["Jumlah",{content:"textFilter"}], width:300 },
					{ id:"harga", header:["Harga",{content:"textFilter"}], width:300 },
					{ id:"createdAt", header:["Tanggal",{content:"textFilter"}], width:150 },
				],
				pager:"pagerTransaksiObatDetail",
			},
			{
				view:"pager",
				id:"pagerTransaksiObatDetail",
				template:"{common.prev()} {common.pages()} {common.next()}",
				size:20,
				group:5
			},
		]};
		return ui;
	}

	formTransaksiObatDetail(){
		return {
			view:"window",
			id:"windowFormTransaksiObatDetail",
			width:600,
			position:"center",
			modal:true,
			move:true,
			head:{
				view:"toolbar", margin:-4, cols:[
					{ view:"label", label: "Tambah", id:"judulFormTransaksiObatDetail" },
					{ view:"button", type:"iconButton", label:"Tutup", icon:"fa fa-times", width:80, click:"$$('windowFormTransaksiObatDetail').hide();"},
				]
			},
			body:{
				view:"form",
				id:"formTransaksiObatDetail",
				borderless:true,
				elements:[
					{ view:"combo", label:"Transaksi Obat", labelWidth:100, name:"id_transaksi_obat", options: "http://localhost:3003/transaksi-obat/options" },
					{ view:"combo", label:"Obat", name:"id_obat", labelWidth:100, options: "http://localhost:3003/obats/options" },
					{ view:"text", label:"Jumlah", name:"jumlah", labelWidth:100, require:true },
					{ view:"text", label:"Harga", name:"harga", labelWidth:100, },
					{ cols: [
						{ template:"", borderless:true },
						{ view:"button", click:()=>this.simpanTransaksiObatDetail(), label:"Simpan", type:"form", width:120, borderless:true },
						{ template:"", borderless:true },
					]}
				]
			}
		};
	}

	refreshTransaksiObatDetail(){
		$$("tabelTransaksiObatDetail").clearAll();
		$$("tabelTransaksiObatDetail").load("http://localhost:3003/transaksi-obat-detail");
	}

	tambahTransaksiObatDetail(){
		$$("windowFormTransaksiObatDetail").show();
		$$("formTransaksiObatDetail").clear();
		$$("judulFormTransaksiObatDetail").setValue("Form Tambah TransaksiObatDetail");
	}

	ubahTransaksiObatDetail(){
		var row = $$("tabelTransaksiObatDetail").getSelectedItem();
		if (row) {
			$$("windowFormTransaksiObatDetail").show();
			$$("formTransaksiObatDetail").clear();
			$$("formTransaksiObatDetail").setValues(row);
			$$("judulFormTransaksiObatDetail").setValue("Form Ubah TransaksiObatDetail");
		}
		else {
			webix.alert("Tidak ada data akun yang dipilih");
		}
	}

	simpanTransaksiObatDetail(){
		var context = this;

		if ($$("formTransaksiObatDetail").validate()) {
			var dataKirim = $$("formTransaksiObatDetail").getValues();

			var callbackHasil = {
				success:function(response,data,xhr){
					$$("windowFormTransaksiObatDetail").enable();
					var response = JSON.parse(response);
					webix.alert(response.pesan);
					if(response.status==true){
						context.refreshTransaksiObatDetail();
						$$("windowFormTransaksiObatDetail").hide();
					}
				},
				error:function(text,data,xhr){
					webix.alert(text);
					$$("windowFormTransaksiObatDetail").enable();
				}
			};

			$$("windowFormTransaksiObatDetail").disable();

			if (dataKirim.createdAt === undefined ) {
				webix.ajax().post("http://localhost:3003/transaksi-obat-detail", dataKirim, callbackHasil);
			} else {
				webix.ajax().put("http://localhost:3003/transaksi-obat-detail", dataKirim, callbackHasil);
			}
		}
	}

	hapusTransaksiObatDetail() {
		var row = $$("tabelTransaksiObatDetail").getSelectedItem();
		if (row) {
			var context = this;

			var callbackHasil = {
				success:function(response,data,xhr){
					$$("windowFormTransaksiObatDetail").enable();
					var response = JSON.parse(response);
					webix.alert(response.pesan);
					if(response.status==true) {
						context.refreshTransaksiObatDetail();
						$$("windowFormTransaksiObatDetail").hide();
					}
				},
				error:function(text,data,xhr){
					webix.alert(text);
					$$("windowFormTransaksiObatDetail").enable();
				}
			};

			webix.confirm({
				type:"confirm-warning",
				title:"Konfirmasi",
				ok:"Yakin",
				cancel:"Batal",
				text: "Anda yakin ingin menghapus data ini ?",
				callback:function(jwb){
					if(jwb) {
						webix.ajax().del("http://localhost:3003/transaksi-obat-detail", row, callbackHasil);
					}
				}
			});
		}
		else{
			webix.alert("Tidak ada data yang dipilih");
		}
	}

	cetakTagihanPdf(){
		var row = $$("tabelTransaksiObatDetail").getSelectedItem();
		if(row){
			$$("cetakTagihan").parse(row);
			webix.print($$("cetakTagihan"));
		} else {
			webix.alert("Tidak ada data yang dipilih");
		}
	}

	cetakTagihan() {
		return {
			view: "template",
			id:"cetakTagihan",
			template: `<table width='400'>
						<tr>
							<td>Transaksi Obat : </td><td>#id_transaksi_obat#</td>
						</tr>
						<tr>
							<td>Nama Obat :</td><td>#nama_obat#</td>
						</tr>
						<tr>
							<td>Harga Obat :</td><td>#harga_obat#</td>
						</tr>
                        <tr>
							<td>Jumlah :</td><td>#jumlah#</td>
						</tr>
                        <tr>
							<td>Harga :</td><td>#harga#</td>
						</tr>
						<tr>
							<td>Tanggal :</td><td>#createdAt#</td>
						</tr>
					  </table>`
		};
	}

	init(){
		this.ui(this.formTransaksiObatDetail());
		this.ui(this.cetakTagihan());
	}

	ready(){
		this.refreshTransaksiObatDetail();
	}
}