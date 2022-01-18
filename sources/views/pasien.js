/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { JetView } from "webix-jet";    

export default class Pasien extends JetView {
	config(){
		var ui = {rows: [
			{ view:"template", template:"Data Pasien", type:"header" },
			{
				view:"toolbar", paddingY:2,
				cols:[
					{ view:"button", click:()=>this.tambahPasien(), label:"Tambah", type:"iconButton", width:100 },
					{ view:"button", click:()=>this.refreshPasien(), label:"Refresh", type:"iconButton", width:100 },
					{ view:"button", click:()=>this.kartuPasienPdf(), label:"Cetak PDF", type:"iconButton", width:100 },
					{ template:"", borderless:true },
					{ view:"button", click:()=>this.ubahPasien(), label:"Ubah", type:"iconButton", width:100 },
					{ view:"button", click:()=>this.hapusPasien(), label:"Hapus", type:"iconButton", width:100 },
				]
			},
			{
				view:"datatable",
				select: true,
				id:"tabelPasien",
				columns: [
					{ id:"no_rm", header:["No RM",{content:"textFilter"}], width:100 },
					{ id:"nama", header:["Nama",{content:"textFilter"}], width:100 },
					{ id:"alamat", header:["Alamat",{content:"textFilter"}], width:100 },
					{ id:"no_telp", header:["Telp",{content:"textFilter"}], width:100 },
				],
				pager:"pagerPasien",
			},
			{
				view:"pager",
				id:"pagerPasien",
				template:"{common.prev()} {common.pages()} {common.next()}",
				size:20,
				group:5
			},
		]};
		return ui;
	}

	formPasien(){
		return {
			view:"window",
			id:"windowFormPasien",
			width:600,
			position:"center",
			modal:true,
			move:true,
			head:{
				view:"toolbar", margin:-4, cols:[
					{ view:"label", label: "Tambah", id:"judulFormPasien" },
					{ view:"button", type:"iconButton", label:"Tutup", width:80, click:"$$('windowFormPasien').hide();"},
				]
			},
			body:{
				view:"form",
				id:"formPasien",
				borderless:true,
				elements:[
					{ view:"text", label:"No RM", name:"no_rm", labelWidth:100, require:true },
					{ view:"text", label:"Nama", name:"nama", labelWidth:100, require:true },
					{ view:"text", label:"Alamat", name:"alamat", labelWidth:100, require:true },
					{ view:"text", label:"Telp", name:"no_telp", labelWidth:100, require:true },
					{ cols: [
						{ template:"", borderless:true },
						{ view:"button", click:()=>this.simpanPasien(), label:"Simpan", width:120, borderless:true },
						{ template:"", borderless:true },
					]}
				]
			}
		};
	}

	refreshPasien(){
		$$("tabelPasien").clearAll();
		$$("tabelPasien").load("http://localhost:3000/pasiens");
	}

	tambahPasien(){
		$$("windowFormPasien").show();
		$$("formPasien").clear();
		$$("judulFormPasien").setValue("Form Tambah Pasien");
	}

	ubahPasien(){
		var row = $$("tabelPasien").getSelectedItem();
		if (row) {
			$$("windowFormPasien").show();
			$$("formPasien").clear();
			$$("formPasien").setValues(row);
			$$("judulFormPasien").setValue("Form Ubah Pasien");
		}
		else {
			webix.alert("Tidak ada data akun yang dipilih");
		}
	}

	simpanPasien(){
		var context = this;

		if ($$("formPasien").validate()) {
			var dataKirim = $$("formPasien").getValues();

			var callbackHasil = {
				success:function(response,data,xhr){
					$$("windowFormPasien").enable();
					var response = JSON.parse(response);
					webix.alert(response.pesan);
					if(response.status==true){
						context.refreshPasien();
						$$("windowFormPasien").hide();
					}
				},
				error:function(text,data,xhr){
					webix.alert(text);
					$$("windowFormPasien").enable();
				}
			};

			$$("windowFormPasien").disable();

			if (dataKirim.createdAt === undefined ) {
				webix.ajax().post("http://localhost:3000/pasiens", dataKirim, callbackHasil);
			} else {
				webix.ajax().put("http://localhost:3000/pasiens", dataKirim, callbackHasil);
			}
		}
	}

	hapusPasien() {
		var row = $$("tabelPasien").getSelectedItem();
		if (row) {
			var context = this;

			var callbackHasil = {
				success:function(response,data,xhr){
					$$("windowFormPasien").enable();
					var response = JSON.parse(response);
					webix.alert(response.pesan);
					if(response.status==true) {
						context.refreshPasien();
						$$("windowFormPasien").hide();
					}
				},
				error:function(text,data,xhr){
					webix.alert(text);
					$$("windowFormPasien").enable();
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
						webix.ajax().del("http://localhost:3000/pasiens", row, callbackHasil);
					}
				}
			});
		}
		else{
			webix.alert("Tidak ada data yang dipilih");
		}
	}

	kartuPasienPdf(){
		var row = $$("tabelPasien").getSelectedItem();
		if(row){
			$$("kartuPasien").parse(row);
			webix.print($$("kartuPasien"));
		} else {
			webix.alert("Tidak ada data yang dipilih");
		}
	}

	kartuPasien() {
		return {
			view: "template",
			id:"kartuPasien",
			template: `<table width='400'>
						<tr>
							<td width='60'> No. RM: </td><td>#no_rm#</td>
						</tr>
						<tr>
							<td>Nama: </td><td>#nama#</td>
						</tr>
						<tr>
							<td>Alamat:</td><td>#alamat#</td>
						</tr>
					  </table>`
		};
	}

	init(){
		this.ui(this.formPasien());
		this.ui(this.kartuPasien());
	}

	ready(){
		this.refreshPasien();
	}
}