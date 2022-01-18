/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { JetView } from "webix-jet";    

export default class TransaksiPenunjang extends JetView {
	config(){
		var ui = {rows: [
			{ view:"template", template:"Data Transaksi Penunjang", type:"header" },
			{
				view:"toolbar", paddingY:2,
				cols:[
					{ view:"button", click:()=>this.tambahTransaksiPenunjang(), label:"Tambah", type:"iconButton", width:100 },
					{ view:"button", click:()=>this.refreshTransaksiPenunjang(), label:"Refresh", type:"iconButton", width:100 },
					{ view:"button", click:()=>this.cetakHasilPemeriksaanPdf(), label:"Cetak Hasil Pemeriksaan ", type:"iconButton", width:200 },
					{ template:"", borderless:true },
					{ view:"button", click:()=>this.ubahTransaksiPenunjang(), label:"Ubah", type:"iconButton", width:100 },
					{ view:"button", click:()=>this.hapusTransaksiPenunjang(), label:"Hapus", type:"iconButton", width:100 },
				]
			},
			{
				view:"datatable",
				select: true,
				id:"tabelTransaksiPenunjang",
				columns: [
					{ id:"id_transaksi_periksa", header:["Transaksi Periksa",{content:"textFilter"}], width:100 },
					{ id:"biaya_transaksi_periksa", header:["Biaya Transaksi Periksa",{content:"textFilter"}], width:100 },
					{ id:"createdAt", header:["Tanggal",{content:"textFilter"}], width:150 },
				],
				pager:"pagerTransaksiPenunjang",
			},
			{
				view:"pager",
				id:"pagerTransaksiPenunjang",
				template:"{common.prev()} {common.pages()} {common.next()}",
				size:20,
				group:5
			},
		]};
		return ui;
	}

	formTransaksiPenunjang(){
		return {
			view:"window",
			id:"windowFormTransaksiPenunjang",
			width:600,
			position:"center",
			modal:true,
			move:true,
			head:{
				view:"toolbar", margin:-4, cols:[
					{ view:"label", label: "Tambah", id:"judulFormTransaksiPenunjang" },
					{ view:"button", type:"iconButton", label:"Tutup", width:80, click:"$$('windowFormTransaksiPenunjang').hide();"},
				]
			},
			body:{
				view:"form",
				id:"formTransaksiPenunjang",
				borderless:true,
				elements:[
					{ view:"combo", label:"Transaksi Periksa", name:"id_transaksi_periksa", options: "http://localhost:3001/transaksi-periksa/options" },
					{ cols: [
						{ template:"", borderless:true },
						{ view:"button", click:()=>this.simpanTransaksiPenunjang(), label:"Simpan", width:120, borderless:true },
						{ template:"", borderless:true },
					]}
				]
			}
		};
	}

	refreshTransaksiPenunjang(){
		$$("tabelTransaksiPenunjang").clearAll();
		$$("tabelTransaksiPenunjang").load("http://localhost:3002/transaksi-penunjang");
	}

	tambahTransaksiPenunjang(){
		$$("windowFormTransaksiPenunjang").show();
		$$("formTransaksiPenunjang").clear();
		$$("judulFormTransaksiPenunjang").setValue("Form Tambah TransaksiPenunjang");
	}

	ubahTransaksiPenunjang(){
		var row = $$("tabelTransaksiPenunjang").getSelectedItem();
		if (row) {
			$$("windowFormTransaksiPenunjang").show();
			$$("formTransaksiPenunjang").clear();
			$$("formTransaksiPenunjang").setValues(row);
			$$("judulFormTransaksiPenunjang").setValue("Form Ubah TransaksiPenunjang");
		}
		else {
			webix.alert("Tidak ada data akun yang dipilih");
		}
	}

	simpanTransaksiPenunjang(){
		var context = this;

		if ($$("formTransaksiPenunjang").validate()) {
			var dataKirim = $$("formTransaksiPenunjang").getValues();

			var callbackHasil = {
				success:function(response,data,xhr){
					$$("windowFormTransaksiPenunjang").enable();
					var response = JSON.parse(response);
					webix.alert(response.pesan);
					if(response.status==true){
						context.refreshTransaksiPenunjang();
						$$("windowFormTransaksiPenunjang").hide();
					}
				},
				error:function(text,data,xhr){
					webix.alert(text);
					$$("windowFormTransaksiPenunjang").enable();
				}
			};

			$$("windowFormTransaksiPenunjang").disable();

			if (dataKirim.createdAt === undefined ) {
				webix.ajax().post("http://localhost:3002/transaksi-penunjang", dataKirim, callbackHasil);
			} else {
				webix.ajax().put("http://localhost:3002/transaksi-penunjang", dataKirim, callbackHasil);
			}
		}
	}

	hapusTransaksiPenunjang() {
		var row = $$("tabelTransaksiPenunjang").getSelectedItem();
		if (row) {
			var context = this;

			var callbackHasil = {
				success:function(response,data,xhr){
					$$("windowFormTransaksiPenunjang").enable();
					var response = JSON.parse(response);
					webix.alert(response.pesan);
					if(response.status==true) {
						context.refreshTransaksiPenunjang();
						$$("windowFormTransaksiPenunjang").hide();
					}
				},
				error:function(text,data,xhr){
					webix.alert(text);
					$$("windowFormTransaksiPenunjang").enable();
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
						webix.ajax().del("http://localhost:3002/transaksi-penunjang", row, callbackHasil);
					}
				}
			});
		}
		else{
			webix.alert("Tidak ada data yang dipilih");
		}
	}

	cetakHasilPemeriksaanPdf(){
		var row = $$("tabelTransaksiPenunjang").getSelectedItem();
		if(row){
			$$("cetakHasilPemeriksaan").parse(row);
			webix.print($$("cetakHasilPemeriksaan"));
		} else {
			webix.alert("Tidak ada data yang dipilih");
		}
	}

	cetakHasilPemeriksaan() {
		return {
			view: "template",
			id:"cetakHasilPemeriksaan",
			template: `<table width='400'>
						<tr>
							<td>Transaksi Periksa :</td><td>#id_transaksi_periksa#</td>
						</tr>
						<tr>
							<td>Biaya Transaksi Periksa :</td><td>#biaya_transaksi_periksa#</td>
						</tr>
						<tr>
							<td>Tanggal :</td><td>#createdAt#</td>
						</tr>
					  </table>`
		};
	}

	init(){
		this.ui(this.formTransaksiPenunjang());
		this.ui(this.cetakHasilPemeriksaan());
	}

	ready(){
		this.refreshTransaksiPenunjang();
	}
}