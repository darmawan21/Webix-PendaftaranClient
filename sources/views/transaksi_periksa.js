/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { JetView } from "webix-jet";    

export default class TransaksiPeriksa extends JetView {
	config(){
		var ui = {rows: [
			{ view:"template", template:"Transaksi Periksa", type:"header" },
			{
				view:"toolbar", paddingY:2,
				cols:[
					{ view:"button", click:()=>this.tambahTransaksiPeriksa(), label:"Tambah", type:"iconButton", icon:"fa fa-plus", width:100 },
					{ view:"button", click:()=>this.refreshTransaksiPeriksa(), label:"Refresh", type:"iconButton", icon:"fa fa-sync", width:100 },
					{ view:"button", click:()=>this.cetakPeriksaPdf(), label:"Cetak Rekam Medis", type:"iconButton", width:200 },
					{ template:"", borderless:true },
					{ view:"button", click:()=>this.ubahTransaksiPeriksa(), label:"Ubah", type:"iconButton", icon:"fa fa-edit", width:100 },
					{ view:"button", click:()=>this.hapusTransaksiPeriksa(), label:"Hapus", type:"iconButton", icon:"fa fa-trash-alt", width:100 },
				]
			},
			{
				view:"datatable",
				select: true,
				id:"tabelTransaksiPeriksa",
				columns: [
					{ id:"nama_pasien", header:["Pasien",{content:"textFilter"}], width:300 },
					{ id:"nama_dokter", header:["Dokter",{content:"textFilter"}], width:300 },
					{ id:"nama_diagnosa", header:["Diagnosa",{content:"textFilter"}], width:300 },
					{ id:"createdAt", header:["Tanggal",{content:"textFilter"}], width:150 },
					{ di:"", header:"Aksi", width:100, template:"<button class='detail'>Tindakan</button>"}
				],
				pager:"pagerTransaksiPeriksa",
			},
			{
				view:"pager",
				id:"pagerTransaksiPeriksa",
				template:"{common.prev()} {common.pages()} {common.next()}",
				size:20,
				group:5
			},
		]};
		return ui;
	}

	formTransaksiPeriksa(){
		return {
			view:"window",
			id:"windowFormTransaksiPeriksa",
			width:600,
			position:"center",
			modal:true,
			move:true,
			head:{
				view:"toolbar", margin:-4, cols:[
					{ view:"label", label: "Tambah", id:"judulFormTransaksiPeriksa" },
					{ view:"button", type:"iconButton", label:"Tutup", icon:"fa fa-times", width:80, click:"$$('windowFormTransaksiPeriksa').hide();"},
				]
			},
			body:{
				view:"form",
				id:"formTransaksiPeriksa",
				borderless:true,
				elements:[
					{ view:"combo", label:"Pasien", name:"no_rm", options: "http://localhost:3000/pasiens/options" },
					{ view:"combo", label:"Dokter", name:"id_dokter", options: "http://localhost:3001/dokter/options" },
					{ view:"combo", label:"Diagnosa", name:"id_diagnosa", options: "http://localhost:3001/diagnosa/options" },
					{ view:"text", label:"Biaya", name:"biaya"},
					{ cols: [
						{ template:"", borderless:true },
						{ view:"button", click:()=>this.simpanTransaksiPeriksa(), label:"Simpan", type:"form", width:120, borderless:true },
						{ template:"", borderless:true },
					]}
				]
			}
		};
	}

	refreshTransaksiPeriksa(){
		$$("tabelTransaksiPeriksa").clearAll();
		$$("tabelTransaksiPeriksa").load("http://localhost:3001/transaksi-periksa");
	}

	tambahTransaksiPeriksa(){
		$$("windowFormTransaksiPeriksa").show();
		$$("formTransaksiPeriksa").clear();
		$$("judulFormTransaksiPeriksa").setValue("Form Tambah TransaksiPeriksa");
	}

	ubahTransaksiPeriksa(){
		var row = $$("tabelTransaksiPeriksa").getSelectedItem();
		if (row) {
			$$("windowFormTransaksiPeriksa").show();
			$$("formTransaksiPeriksa").clear();
			$$("formTransaksiPeriksa").setValues(row);
			$$("judulFormTransaksiPeriksa").setValue("Form Ubah TransaksiPeriksa");
		}
		else {
			webix.alert("Tidak ada data akun yang dipilih");
		}
	}

	simpanTransaksiPeriksa(){
		var context = this;

		if ($$("formTransaksiPeriksa").validate()) {
			var dataKirim = $$("formTransaksiPeriksa").getValues();

			var callbackHasil = {
				success:function(response,data,xhr){
					$$("windowFormTransaksiPeriksa").enable();
					var response = JSON.parse(response);
					webix.alert(response.pesan);
					if(response.status==true){
						context.refreshTransaksiPeriksa();
						$$("windowFormTransaksiPeriksa").hide();
					}
				},
				error:function(text,data,xhr){
					webix.alert(text);
					$$("windowFormTransaksiPeriksa").enable();
				}
			};

			$$("windowFormTransaksiPeriksa").disable();

			if (dataKirim.createdAt === undefined ) {
				webix.ajax().post("http://localhost:3001/transaksi-periksa", dataKirim, callbackHasil);
			} else {
				webix.ajax().put("http://localhost:3001/transaksi-periksa", dataKirim, callbackHasil);
			}
		}
	}

	hapusTransaksiPeriksa() {
		var row = $$("tabelTransaksiPeriksa").getSelectedItem();
		if (row) {
			var context = this;

			var callbackHasil = {
				success:function(response,data,xhr){
					$$("windowFormTransaksiPeriksa").enable();
					var response = JSON.parse(response);
					webix.alert(response.pesan);
					if(response.status==true) {
						context.refreshTransaksiPeriksa();
						$$("windowFormTransaksiPeriksa").hide();
					}
				},
				error:function(text,data,xhr){
					webix.alert(text);
					$$("windowFormTransaksiPeriksa").enable();
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
						webix.ajax().del("http://localhost:3001/transaksi-periksa", row, callbackHasil);
					}
				}
			});
		}
		else{
			webix.alert("Tidak ada data yang dipilih");
		}
	}

	cetakPeriksaPdf(){
		var row = $$("tabelTransaksiPeriksa").getSelectedItem();
		if(row){
			$$("cetakPeriksa").parse(row);
			webix.print($$("cetakPeriksa"));
		} else {
			webix.alert("Tidak ada data yang dipilih");
		}
	}

	cetakPeriksa() {
		return {
			view: "template",
			id:"cetakPeriksa",
			template: `<table width='400'>
						<tr>
							<td>Pasien : </td><td>#nama_pasien#</td>
						</tr>
						<tr>
							<td>Dokter :</td><td>#nama_dokter#</td>
						</tr>
						<tr>
							<td>Diagnosa :</td><td>#nama_diagnosa#</td>
						</tr>
						<tr>
							<td>Tanggal :</td><td>#createdAt#</td>
						</tr>
						<tr>
							<td>Aksi:</td><td>Tindakan</td>
						</tr>
					  </table>`
		};
	}

	init(){
		this.ui(this.formTransaksiPeriksa());
		this.ui(this.cetakPeriksa());
	}

	ready(){
		this.refreshTransaksiPeriksa();
	}
}