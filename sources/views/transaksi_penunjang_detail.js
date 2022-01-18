/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { JetView } from "webix-jet";    

export default class TransaksiPenunjangDetail extends JetView {
	config(){
		var ui = {rows: [
			{ view:"template", template:"Data Transaksi Penunjang Detail", type:"header" },
			{
				view:"toolbar", paddingY:2,
				cols:[
					{ view:"button", click:()=>this.tambahTransaksiPenunjangDetail(), label:"Tambah", type:"iconButton", icon:"fa fa-plus", width:100 },
					{ view:"button", click:()=>this.refreshTransaksiPenunjangDetail(), label:"Refresh", type:"iconButton", icon:"fa fa-sync", width:100 },
					{ view:"button", click:()=>this.cetakTagihanPdf(), label:"Cetak Tagihan", type:"iconButton", width:200 },
					{ template:"", borderless:true },
					{ view:"button", click:()=>this.ubahTransaksiPenunjangDetail(), label:"Ubah", type:"iconButton", icon:"fa fa-edit", width:100 },
					{ view:"button", click:()=>this.hapusTransaksiPenunjangDetail(), label:"Hapus", type:"iconButton", icon:"fa fa-trash-alt", width:100 },
				]
			},
			{
				view:"datatable",
				select: true,
				id:"tabelTransaksiPenunjangDetail",
				columns: [
					{ id:"id_transaksi_penunjang", header:["Transaksi Penunjang",{content:"textFilter"}], width:100 },
					{ id:"nama_jenis_penunjang", header:["Nama Jenis Penunjang",{content:"textFilter"}], width:100 },
					{ id:"biaya_jenis_penunjang", header:["Biaya Penunjang",{content:"textFilter"}], width:100 },
					{ id:"hasil", header:["Hasil",{content:"textFilter"}], width:300 },
					{ id:"biaya", header:["Biaya",{content:"textFilter"}], width:300 },
					{ id:"createdAt", header:["Tanggal",{content:"textFilter"}], width:150 },
				],
				pager:"pagerTransaksiPenunjangDetail",
			},
			{
				view:"pager",
				id:"pagerTransaksiPenunjangDetail",
				template:"{common.prev()} {common.pages()} {common.next()}",
				size:20,
				group:5
			},
		]};
		return ui;
	}

	formTransaksiPenunjangDetail(){
		return {
			view:"window",
			id:"windowFormTransaksiPenunjangDetail",
			width:600,
			position:"center",
			modal:true,
			move:true,
			head:{
				view:"toolbar", margin:-4, cols:[
					{ view:"label", label: "Tambah", id:"judulFormTransaksiPenunjangDetail" },
					{ view:"button", type:"iconButton", label:"Tutup", icon:"fa fa-times", width:80, click:"$$('windowFormTransaksiPenunjangDetail').hide();"},
				]
			},
			body:{
				view:"form",
				id:"formTransaksiPenunjangDetail",
				borderless:true,
				elements:[
					{ view:"combo", label:"Transaksi Penunjang", labelWidth:100, name:"id_transaksi_penunjang", options: "http://localhost:3002/transaksi-penunjang/options" },
					{ view:"combo", label:"Jenis Penunjang", labelWidth:100, name:"id_jenis_penunjang", options: "http://localhost:3002/jenis-penunjang/options" },
					{ view:"text", label:"Hasil", name:"hasil", labelWidth:100, require:true },
					{ view:"text", label:"Biaya", name:"biaya", labelWidth:100, },
					{ cols: [
						{ template:"", borderless:true },
						{ view:"button", click:()=>this.simpanTransaksiPenunjangDetail(), label:"Simpan", type:"form", width:120, borderless:true },
						{ template:"", borderless:true },
					]}
				]
			}
		};
	}

	refreshTransaksiPenunjangDetail(){
		$$("tabelTransaksiPenunjangDetail").clearAll();
		$$("tabelTransaksiPenunjangDetail").load("http://localhost:3002/transaksi-penunjang-detail");
	}

	tambahTransaksiPenunjangDetail(){
		$$("windowFormTransaksiPenunjangDetail").show();
		$$("formTransaksiPenunjangDetail").clear();
		$$("judulFormTransaksiPenunjangDetail").setValue("Form Tambah TransaksiPenunjangDetail");
	}

	ubahTransaksiPenunjangDetail(){
		var row = $$("tabelTransaksiPenunjangDetail").getSelectedItem();
		if (row) {
			$$("windowFormTransaksiPenunjangDetail").show();
			$$("formTransaksiPenunjangDetail").clear();
			$$("formTransaksiPenunjangDetail").setValues(row);
			$$("judulFormTransaksiPenunjangDetail").setValue("Form Ubah TransaksiPenunjangDetail");
		}
		else {
			webix.alert("Tidak ada data akun yang dipilih");
		}
	}

	simpanTransaksiPenunjangDetail(){
		var context = this;

		if ($$("formTransaksiPenunjangDetail").validate()) {
			var dataKirim = $$("formTransaksiPenunjangDetail").getValues();

			var callbackHasil = {
				success:function(response,data,xhr){
					$$("windowFormTransaksiPenunjangDetail").enable();
					var response = JSON.parse(response);
					webix.alert(response.pesan);
					if(response.status==true){
						context.refreshTransaksiPenunjangDetail();
						$$("windowFormTransaksiPenunjangDetail").hide();
					}
				},
				error:function(text,data,xhr){
					webix.alert(text);
					$$("windowFormTransaksiPenunjangDetail").enable();
				}
			};

			$$("windowFormTransaksiPenunjangDetail").disable();

			if (dataKirim.createdAt === undefined ) {
				webix.ajax().post("http://localhost:3002/transaksi-penunjang-detail", dataKirim, callbackHasil);
			} else {
				webix.ajax().put("http://localhost:3002/transaksi-penunjang-detail", dataKirim, callbackHasil);
			}
		}
	}

	hapusTransaksiPenunjangDetail() {
		var row = $$("tabelTransaksiPenunjangDetail").getSelectedItem();
		if (row) {
			var context = this;

			var callbackHasil = {
				success:function(response,data,xhr){
					$$("windowFormTransaksiPenunjangDetail").enable();
					var response = JSON.parse(response);
					webix.alert(response.pesan);
					if(response.status==true) {
						context.refreshTransaksiPenunjangDetail();
						$$("windowFormTransaksiPenunjangDetail").hide();
					}
				},
				error:function(text,data,xhr){
					webix.alert(text);
					$$("windowFormTransaksiPenunjangDetail").enable();
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
						webix.ajax().del("http://localhost:3002/transaksi-penunjang-detail", row, callbackHasil);
					}
				}
			});
		}
		else{
			webix.alert("Tidak ada data yang dipilih");
		}
	}

	cetakTagihanPdf(){
		var row = $$("tabelTransaksiPenunjangDetail").getSelectedItem();
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
							<td>Transaksi Penunjang : </td><td>#id_transaksi_penunjang#</td>
						</tr>
						<tr>
							<td>Nama Jenis Penunjang :</td><td>#nama_jenis_penunjang#</td>
						</tr>
						<tr>
							<td>Biaya Penunjang :</td><td>#biaya_jenis_penunjang#</td>
						</tr>
						<tr>
							<td>Hasil :</td><td>#hasil#</td>
						</tr>
						<tr>
							<td>Biaya :</td><td>#biaya#</td>
						</tr>
						<tr>
							<td>Tanggal :</td><td>#createdAt#</td>
						</tr>
					  </table>`
		};
	}

	init(){
		this.ui(this.formTransaksiPenunjangDetail());
		this.ui(this.cetakTagihan());
	}

	ready(){
		this.refreshTransaksiPenunjangDetail();
	}
}