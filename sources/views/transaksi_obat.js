/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { JetView } from "webix-jet";    

export default class TransaksiObat extends JetView {
	config(){
		var ui = {rows: [
			{ view:"template", template:"Dat3 Transaksi obat", type:"header" },
			{
				view:"toolbar", paddingY:2,
				cols:[
					{ view:"button", click:()=>this.tambahTransaksiObat(), label:"Tambah", type:"iconButton", width:100 },
					{ view:"button", click:()=>this.refreshTransaksiObat(), label:"Refresh", type:"iconButton", width:100 },
					{ template:"", borderless:true },
					{ view:"button", click:()=>this.ubahTransaksiObat(), label:"Ubah", type:"iconButton", width:100 },
					{ view:"button", click:()=>this.hapusTransaksiObat(), label:"Hapus", type:"iconButton", width:100 },
				]
			},
			{
				view:"datatable",
				select: true,
				id:"tabelTransaksiObat",
				columns: [
					{ id:"id_transaksi_periksa", header:["Transaksi Periksa",{content:"textFilter"}], width:100 },
					{ id:"biaya_transaksi_periksa", header:["Biaya Transaksi Periksa",{content:"textFilter"}], width:100 },
					{ id:"createdAt", header:["Tanggal",{content:"textFilter"}], width:150 },
				],
				pager:"pagerTransaksiObat",
			},
			{
				view:"pager",
				id:"pagerTransaksiObat",
				template:"{common.prev()} {common.pages()} {common.next()}",
				size:20,
				group:5
			},
		]};
		return ui;
	}

	formTransaksiObat(){
		return {
			view:"window",
			id:"windowFormTransaksiObat",
			width:600,
			position:"center",
			modal:true,
			move:true,
			head:{
				view:"toolbar", margin:-4, cols:[
					{ view:"label", label: "Tambah", id:"judulFormTransaksiObat" },
					{ view:"button", type:"iconButton", label:"Tutup", width:80, click:"$$('windowFormTransaksiObat').hide();"},
				]
			},
			body:{
				view:"form",
				id:"formTransaksiObat",
				borderless:true,
				elements:[
					{ view:"combo", label:"Id Transaksi Periksa", name:"id_transaksi_periksa", options: "http://localhost:3001/transaksi-periksa/options" },
					{ cols: [
						{ template:"", borderless:true },
						{ view:"button", click:()=>this.simpanTransaksiObat(), label:"Simpan", width:120, borderless:true },
						{ template:"", borderless:true },
					]}
				]
			}
		};
	}

	refreshTransaksiObat(){
		$$("tabelTransaksiObat").clearAll();
		$$("tabelTransaksiObat").load("http://localhost:3003/transaksi-obat");
	}

	tambahTransaksiObat(){
		$$("windowFormTransaksiObat").show();
		$$("formTransaksiObat").clear();
		$$("judulFormTransaksiObat").setValue("Form Tambah TransaksiObat");
	}

	ubahTransaksiObat(){
		var row = $$("tabelTransaksiObat").getSelectedItem();
		if (row) {
			$$("windowFormTransaksiObat").show();
			$$("formTransaksiObat").clear();
			$$("formTransaksiObat").setValues(row);
			$$("judulFormTransaksiObat").setValue("Form Ubah TransaksiObat");
		}
		else {
			webix.alert("Tidak ada data akun yang dipilih");
		}
	}

	simpanTransaksiObat(){
		var context = this;

		if ($$("formTransaksiObat").validate()) {
			var dataKirim = $$("formTransaksiObat").getValues();

			var callbackHasil = {
				success:function(response,data,xhr){
					$$("windowFormTransaksiObat").enable();
					var response = JSON.parse(response);
					webix.alert(response.pesan);
					if(response.status==true){
						context.refreshTransaksiObat();
						$$("windowFormTransaksiObat").hide();
					}
				},
				error:function(text,data,xhr){
					webix.alert(text);
					$$("windowFormTransaksiObat").enable();
				}
			};

			$$("windowFormTransaksiObat").disable();

			if (dataKirim.createdAt === undefined ) {
				webix.ajax().post("http://localhost:3003/transaksi-obat", dataKirim, callbackHasil);
			} else {
				webix.ajax().put("http://localhost:3003/transaksi-obat", dataKirim, callbackHasil);
			}
		}
	}

	hapusTransaksiObat() {
		var row = $$("tabelTransaksiObat").getSelectedItem();
		if (row) {
			var context = this;

			var callbackHasil = {
				success:function(response,data,xhr){
					$$("windowFormTransaksiObat").enable();
					var response = JSON.parse(response);
					webix.alert(response.pesan);
					if(response.status==true) {
						context.refreshTransaksiObat();
						$$("windowFormTransaksiObat").hide();
					}
				},
				error:function(text,data,xhr){
					webix.alert(text);
					$$("windowFormTransaksiObat").enable();
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
						webix.ajax().del("http://localhost:3003/transaksi-obat", row, callbackHasil);
					}
				}
			});
		}
		else{
			webix.alert("Tidak ada data yang dipilih");
		}
	}

	init(){
		this.ui(this.formTransaksiObat());
	}

	ready(){
		this.refreshTransaksiObat();
	}
}