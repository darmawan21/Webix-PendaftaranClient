/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { JetView } from "webix-jet";    

export default class TransaksiPeriksaDetail extends JetView {
	config(){
		var ui = {rows: [
			{ view:"template", template:"Transaksi Periksa Detail", type:"header" },
			{
				view:"toolbar", paddingY:2,
				cols:[
					{ view:"button", click:()=>this.tambahTransaksiPeriksaDetail(), label:"Tambah", type:"iconButton", icon:"fa fa-plus", width:100 },
					{ view:"button", click:()=>this.refreshTransaksiPeriksaDetail(), label:"Refresh", type:"iconButton", icon:"fa fa-sync", width:100 },
					{ view:"button", click:()=>this.cetakTagihanPdf(), label:"Cetak Tagihan", type:"iconButton", width:200 },
					{ template:"", borderless:true },
					{ view:"button", click:()=>this.ubahTransaksiPeriksaDetail(), label:"Ubah", type:"iconButton", icon:"fa fa-edit", width:100 },
					{ view:"button", click:()=>this.hapusTransaksiPeriksaDetail(), label:"Hapus", type:"iconButton", icon:"fa fa-trash-alt", width:100 },
				]
			},
			{
				view:"datatable",
				select: true,
				id:"tabelTransaksiPeriksaDetail",
				columns: [
					{ id:"id_transaksi_periksa", header:["Transaksi Periksa",{content:"textFilter"}], width:300 },
					{ id:"nama_tindakan", header:["Tindakan Medis",{content:"textFilter"}], width:300 },
					{ id:"biaya", header:["Biaya",{content:"textFilter"}], width:300 },
					{ id:"createdAt", header:["Tanggal",{content:"textFilter"}], width:150 },
				],
				pager:"pagerTransaksiPeriksaDetail",
			},
			{
				view:"pager",
				id:"pagerTransaksiPeriksaDetail",
				template:"{common.prev()} {common.pages()} {common.next()}",
				size:20,
				group:5
			},
		]};
		return ui;
	}

	formTransaksiPeriksaDetail(){
		return {
			view:"window",
			id:"windowFormTransaksiPeriksaDetail",
			width:600,
			position:"center",
			modal:true,
			move:true,
			head:{
				view:"toolbar", margin:-4, cols:[
					{ view:"label", label: "Tambah", id:"judulFormTransaksiPeriksaDetail" },
					{ view:"button", type:"iconButton", label:"Tutup", icon:"fa fa-times", width:80, click:"$$('windowFormTransaksiPeriksaDetail').hide();"},
				]
			},
			body:{
				view:"form",
				id:"formTransaksiPeriksaDetail",
				borderless:true,
				elements:[
					{ view:"combo", label:"Transaksi Periksa", name:"id_transaksi_periksa", options: "http://localhost:3001/transaksi-periksa/options" },
					{ view:"combo", label:"Tindakan", name:"id_tindakan", options: "http://localhost:3001/tindakan-medis/options" },
					{ view:"text", label:"Biaya", name:"biaya"},
					{ cols: [
						{ template:"", borderless:true },
						{ view:"button", click:()=>this.simpanTransaksiPeriksaDetail(), label:"Simpan", type:"form", width:120, borderless:true },
						{ template:"", borderless:true },
					]}
				]
			}
		};
	}

	refreshTransaksiPeriksaDetail(){
		$$("tabelTransaksiPeriksaDetail").clearAll();
		$$("tabelTransaksiPeriksaDetail").load("http://localhost:3001/transaksi-periksa-detail");
	}

	tambahTransaksiPeriksaDetail(){
		$$("windowFormTransaksiPeriksaDetail").show();
		$$("formTransaksiPeriksaDetail").clear();
		$$("judulFormTransaksiPeriksaDetail").setValue("Form Tambah TransaksiPeriksaDetail");
	}

	ubahTransaksiPeriksaDetail(){
		var row = $$("tabelTransaksiPeriksaDetail").getSelectedItem();
		if (row) {
			$$("windowFormTransaksiPeriksaDetail").show();
			$$("formTransaksiPeriksaDetail").clear();
			$$("formTransaksiPeriksaDetail").setValues(row);
			$$("judulFormTransaksiPeriksaDetail").setValue("Form Ubah TransaksiPeriksaDetail");
		}
		else {
			webix.alert("Tidak ada data akun yang dipilih");
		}
	}

	simpanTransaksiPeriksaDetail(){
		var context = this;

		if ($$("formTransaksiPeriksaDetail").validate()) {
			var dataKirim = $$("formTransaksiPeriksaDetail").getValues();

			var callbackHasil = {
				success:function(response,data,xhr){
					$$("windowFormTransaksiPeriksaDetail").enable();
					var response = JSON.parse(response);
					webix.alert(response.pesan);
					if(response.status==true){
						context.refreshTransaksiPeriksaDetail();
						$$("windowFormTransaksiPeriksaDetail").hide();
					}
				},
				error:function(text,data,xhr){
					webix.alert(text);
					$$("windowFormTransaksiPeriksaDetail").enable();
				}
			};

			$$("windowFormTransaksiPeriksaDetail").disable();

			if (dataKirim.createdAt === undefined ) {
				webix.ajax().post("http://localhost:3001/transaksi-periksa-detail", dataKirim, callbackHasil);
			} else {
				webix.ajax().put("http://localhost:3001/transaksi-periksa-detail", dataKirim, callbackHasil);
			}
		}
	}

	hapusTransaksiPeriksaDetail() {
		var row = $$("tabelTransaksiPeriksaDetail").getSelectedItem();
		if (row) {
			var context = this;

			var callbackHasil = {
				success:function(response,data,xhr){
					$$("windowFormTransaksiPeriksaDetail").enable();
					var response = JSON.parse(response);
					webix.alert(response.pesan);
					if(response.status==true) {
						context.refreshTransaksiPeriksaDetail();
						$$("windowFormTransaksiPeriksaDetail").hide();
					}
				},
				error:function(text,data,xhr){
					webix.alert(text);
					$$("windowFormTransaksiPeriksaDetail").enable();
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
						webix.ajax().del("http://localhost:3001/transaksi-periksa-detail", row, callbackHasil);
					}
				}
			});
		}
		else{
			webix.alert("Tidak ada data yang dipilih");
		}
	}
	
	cetakTagihanPdf(){
		var row = $$("tabelTransaksiPeriksaDetail").getSelectedItem();
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
							<td>Transaksi Periksa : </td><td>#id_transaksi_periksa#</td>
						</tr>
						<tr>
							<td>Tindakan Medis :</td><td>#nama_tindakan#</td>
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
		this.ui(this.formTransaksiPeriksaDetail());
		this.ui(this.cetakTagihan());
	}

	ready(){
		this.refreshTransaksiPeriksaDetail();
	}
}