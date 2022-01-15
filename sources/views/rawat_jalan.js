/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { JetView } from "webix-jet";    

export default class RawatJalan extends JetView {
	config(){
		var ui = {rows: [
			{ view:"template", template:"Data Rawat Jalan", type:"header" },
			{
				view:"toolbar", paddingY:2,
				cols:[
					{ view:"button", click:()=>this.tambahRawatJalan(), label:"Tambah", type:"iconButton", icon:"fa fa-plus", width:100 },
					{ view:"button", click:()=>this.refreshRawatJalan(), label:"Refresh", type:"iconButton", icon:"fa fa-sync", width:100 },
					{ template:"", borderless:true },
					{ view:"button", click:()=>this.ubahRawatJalan(), label:"Ubah", type:"iconButton", icon:"fa fa-edit", width:100 },
					{ view:"button", click:()=>this.hapusRawatJalan(), label:"Hapus", type:"iconButton", icon:"fa fa-trash-alt", width:100 },
				]
			},
			{
				view:"datatable",
				select: true,
				id:"tabelRawatJalan",
				columns: [
					{ id:"no_rm", header:["No RM",{content:"textFilter"}], width:100 },
					{ id:"nama_pasien", header:["Nama",{content:"textFilter"}], width:300 },
					{ id:"nama_poli", header:["Poli",{content:"textFilter"}], width:300 },
					{ id:"createdAt", header:["Tanggal",{content:"textFilter"}], width:150 },
				],
				pager:"pagerRawatJalan",
			},
			{
				view:"pager",
				id:"pagerRawatJalan",
				template:"{common.prev()} {common.pages()} {common.next()}",
				size:20,
				group:5
			},
		]};
		return ui;
	}

	formRawatJalan(){
		return {
			view:"window",
			id:"windowFormRawatJalan",
			width:600,
			position:"center",
			modal:true,
			move:true,
			head:{
				view:"toolbar", margin:-4, cols:[
					{ view:"label", label: "Tambah", id:"judulFormRawatJalan" },
					{ view:"button", type:"iconButton", label:"Tutup", icon:"fa fa-times", width:80, click:"$$('windowFormRawatJalan').hide();"},
				]
			},
			body:{
				view:"form",
				id:"formRawatJalan",
				borderless:true,
				elements:[
					{ view:"combo", label:"Pasien", name:"no_rm", options: "http://localhost:3000/pasiens/options" },
					{ view:"combo", label:"Poli", name:"id_poli", options: "http://localhost:3001/poli/options" },
					{ cols: [
						{ template:"", borderless:true },
						{ view:"button", click:()=>this.simpanRawatJalan(), label:"Simpan", type:"form", width:120, borderless:true },
						{ template:"", borderless:true },
					]}
				]
			}
		};
	}

	refreshRawatJalan(){
		$$("tabelRawatJalan").clearAll();
		$$("tabelRawatJalan").load("http://localhost:3000/pendaftaran-rawat-jalan");
	}

	tambahRawatJalan(){
		$$("windowFormRawatJalan").show();
		$$("formRawatJalan").clear();
		$$("judulFormRawatJalan").setValue("Form Tambah RawatJalan");
	}

	ubahRawatJalan(){
		var row = $$("tabelRawatJalan").getSelectedItem();
		if (row) {
			$$("windowFormRawatJalan").show();
			$$("formRawatJalan").clear();
			$$("formRawatJalan").setValues(row);
			$$("judulFormRawatJalan").setValue("Form Ubah RawatJalan");
		}
		else {
			webix.alert("Tidak ada data akun yang dipilih");
		}
	}

	simpanRawatJalan(){
		var context = this;

		if ($$("formRawatJalan").validate()) {
			var dataKirim = $$("formRawatJalan").getValues();

			var callbackHasil = {
				success:function(response,data,xhr){
					$$("windowFormRawatJalan").enable();
					var response = JSON.parse(response);
					webix.alert(response.pesan);
					if(response.status==true){
						context.refreshRawatJalan();
						$$("windowFormRawatJalan").hide();
					}
				},
				error:function(text,data,xhr){
					webix.alert(text);
					$$("windowFormRawatJalan").enable();
				}
			};

			$$("windowFormRawatJalan").disable();

			if (dataKirim.createdAt === undefined ) {
				webix.ajax().post("http://localhost:3000/pendaftaran-rawat-jalan", dataKirim, callbackHasil);
			} else {
				webix.ajax().put("http://localhost:3000/pendaftaran-rawat-jalan", dataKirim, callbackHasil);
			}
		}
	}

	hapusRawatJalan() {
		var row = $$("tabelRawatJalan").getSelectedItem();
		if (row) {
			var context = this;

			var callbackHasil = {
				success:function(response,data,xhr){
					$$("windowFormRawatJalan").enable();
					var response = JSON.parse(response);
					webix.alert(response.pesan);
					if(response.status==true) {
						context.refreshRawatJalan();
						$$("windowFormRawatJalan").hide();
					}
				},
				error:function(text,data,xhr){
					webix.alert(text);
					$$("windowFormRawatJalan").enable();
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
						webix.ajax().del("http://localhost:3000/pendaftaran-rawat-jalan", row, callbackHasil);
					}
				}
			});
		}
		else{
			webix.alert("Tidak ada data yang dipilih");
		}
	}

	init(){
		this.ui(this.formRawatJalan());
	}

	ready(){
		this.refreshRawatJalan();
	}
}