/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { JetView } from "webix-jet";    

export default class TindakanMedis extends JetView {
	config(){
		var ui = {rows: [
			{ view:"template", template:"Data Tindakan Medis", type:"header" },
			{
				view:"toolbar", paddingY:2,
				cols:[
					{ view:"button", click:()=>this.tambahTindakanMedis(), label:"Tambah", type:"iconButton", width:100 },
					{ view:"button", click:()=>this.refreshTindakanMedis(), label:"Refresh", type:"iconButton", width:100 },
					{ template:"", borderless:true },
					{ view:"button", click:()=>this.ubahTindakanMedis(), label:"Ubah", type:"iconButton", width:100 },
					{ view:"button", click:()=>this.hapusTindakanMedis(), label:"Hapus", type:"iconButton", width:100 },
				]
			},
			{
				view:"datatable",
				select: true,
				id:"tabelTindakanMedis",
				columns: [
					{ id:"nama", header:["Nama",{content:"textFilter"}], width:100 },
					{ id:"biaya", header:["Biaya",{content:"textFilter"}], width:100 },
					{ id:"createdAt", header:["Tanggal",{content:"textFilter"}], width:150 },
				],
				pager:"pagerTindakanMedis",
			},
			{
				view:"pager",
				id:"pagerTindakanMedis",
				template:"{common.prev()} {common.pages()} {common.next()}",
				size:20,
				group:5
			},
		]};
		return ui;
	}

	formTindakanMedis(){
		return {
			view:"window",
			id:"windowFormTindakanMedis",
			width:600,
			position:"center",
			modal:true,
			move:true,
			head:{
				view:"toolbar", margin:-4, cols:[
					{ view:"label", label: "Tambah", id:"judulFormTindakanMedis" },
					{ view:"button", type:"iconButton", label:"Tutup", width:80, click:"$$('windowFormTindakanMedis').hide();"},
				]
			},
			body:{
				view:"form",
				id:"formTindakanMedis",
				borderless:true,
				elements:[
					{ view:"text", label:"Nama", name:"nama", labelWidth:100, require:true },
					{ view:"text", label:"Biaya", name:"biaya", labelWidth:100, },
					{ cols: [
						{ template:"", borderless:true },
						{ view:"button", click:()=>this.simpanTindakanMedis(), label:"Simpan", width:120, borderless:true },
						{ template:"", borderless:true },
					]}
				]
			}
		};
	}

	refreshTindakanMedis(){
		$$("tabelTindakanMedis").clearAll();
		$$("tabelTindakanMedis").load("http://localhost:3001/tindakan-medis");
	}

	tambahTindakanMedis(){
		$$("windowFormTindakanMedis").show();
		$$("formTindakanMedis").clear();
		$$("judulFormTindakanMedis").setValue("Form Tambah TindakanMedis");
	}

	ubahTindakanMedis(){
		var row = $$("tabelTindakanMedis").getSelectedItem();
		if (row) {
			$$("windowFormTindakanMedis").show();
			$$("formTindakanMedis").clear();
			$$("formTindakanMedis").setValues(row);
			$$("judulFormTindakanMedis").setValue("Form Ubah TindakanMedis");
		}
		else {
			webix.alert("Tidak ada data akun yang dipilih");
		}
	}

	simpanTindakanMedis(){
		var context = this;

		if ($$("formTindakanMedis").validate()) {
			var dataKirim = $$("formTindakanMedis").getValues();

			var callbackHasil = {
				success:function(response,data,xhr){
					$$("windowFormTindakanMedis").enable();
					var response = JSON.parse(response);
					webix.alert(response.pesan);
					if(response.status==true){
						context.refreshTindakanMedis();
						$$("windowFormTindakanMedis").hide();
					}
				},
				error:function(text,data,xhr){
					webix.alert(text);
					$$("windowFormTindakanMedis").enable();
				}
			};

			$$("windowFormTindakanMedis").disable();

			if (dataKirim.createdAt === undefined ) {
				webix.ajax().post("http://localhost:3001/tindakan-medis", dataKirim, callbackHasil);
			} else {
				webix.ajax().put("http://localhost:3001/tindakan-medis", dataKirim, callbackHasil);
			}
		}
	}

	hapusTindakanMedis() {
		var row = $$("tabelTindakanMedis").getSelectedItem();
		if (row) {
			var context = this;

			var callbackHasil = {
				success:function(response,data,xhr){
					$$("windowFormTindakanMedis").enable();
					var response = JSON.parse(response);
					webix.alert(response.pesan);
					if(response.status==true) {
						context.refreshTindakanMedis();
						$$("windowFormTindakanMedis").hide();
					}
				},
				error:function(text,data,xhr){
					webix.alert(text);
					$$("windowFormTindakanMedis").enable();
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
						webix.ajax().del("http://localhost:3001/tindakan-medis", row, callbackHasil);
					}
				}
			});
		}
		else{
			webix.alert("Tidak ada data yang dipilih");
		}
	}

	init(){
		this.ui(this.formTindakanMedis());
	}

	ready(){
		this.refreshTindakanMedis();
	}
}