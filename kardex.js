"use strict";
// ET505 · S9 · Kardex de materiales ficticios.
// Archivo nuevo de comportamiento. Depende de: la sección #kardex de index.html (ids k-*)
// y de las reglas CSS de styles.css. No usa funciones ni variables de app.js (planificador).
// Las existencias son UNIDADES FÍSICAS; el presupuesto de app.js está en CÉNTIMOS. No se mezclan.

// ---------- REGLAS (sin pantalla) ----------
function saldoDe(estado,id){return estado.movimientos.filter(x=>x.materialId===id).reduce((s,x)=>s+(x.tipo==="ENTRADA"?x.cantidad:-x.cantidad),0);}
function agregarMovimiento(estado,id,tipo,cantidad,uid,fecha){
 const material=estado.materiales.find(x=>x.id===id&&x.activo);
 if(!material)throw Error("Seleccione un material activo.");
 if(!["ENTRADA","SALIDA"].includes(tipo)||!Number.isSafeInteger(cantidad)||cantidad<=0)throw Error("Cantidad: entero positivo.");
 const actual=saldoDe(estado,id);
 if(tipo==="SALIDA"&&cantidad>actual)throw Error("La salida supera la existencia.");
 if(tipo==="ENTRADA"&&!Number.isSafeInteger(actual+cantidad))throw Error("Cantidad fuera de rango.");
 return {...estado,movimientos:[...estado.movimientos,{id:uid,materialId:id,tipo,cantidad,fecha}]};
}
function celdaCSV(valor){let s=String(valor);if(/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
function exportarCSV(estado){
 const filas=[["Movimiento","Fecha","MaterialId","Material","Tipo","Cantidad"]];
 for(const m of estado.movimientos)filas.push([m.id,m.fecha,m.materialId,estado.materiales.find(x=>x.id===m.materialId)?.nombre||m.materialId,m.tipo,m.cantidad]);
 return "﻿"+filas.map(f=>f.map(celdaCSV).join(";")).join("\r\n");
}
// Adaptación S9: código corto y estable (MAT-001, MAT-002...). El contador nunca retrocede,
// así un código eliminado no se reutiliza para otro material.
function nuevoCodigo(estado){
 const usados=estado.materiales.map(x=>Number((/^MAT-(\d+)$/.exec(x.id)||[])[1]||0));
 const n=Math.max(estado.contador||0,...usados)+1;
 return {codigo:"MAT-"+String(n).padStart(3,"0"),contador:n};
}
function nombreRepetido(estado,nombre,exceptoId){
 const n=nombre.trim().toLocaleLowerCase();
 return estado.materiales.some(x=>x.activo&&x.id!==exceptoId&&x.nombre.toLocaleLowerCase()===n);
}
function estadoInicial(){
 // Tres materiales ficticios del taller, sin movimientos, para poder probar desde el primer uso.
 return {contador:3,materiales:[{id:"MAT-001",nombre:"LED de 5 mm",activo:true},{id:"MAT-002",nombre:"Pila de 9 V",activo:true},{id:"MAT-003",nombre:"Protoboard pequeña",activo:true}],movimientos:[]};
}
function idMovimiento(){return (globalThis.crypto&&crypto.randomUUID)?crypto.randomUUID():"MOV-"+Date.now()+"-"+Math.random().toString(16).slice(2);}

// ---------- PANTALLA ----------
if(typeof document!=="undefined"){
 const el=id=>document.getElementById(id),clave="et505-s9-kardex-v1";
 let estado={contador:0,materiales:[],movimientos:[]},bloqueado=false;
 const mensaje=(t,tipo="")=>{const m=el("k-mensaje");m.textContent=t;m.className=tipo;};
 try{
  const texto=localStorage.getItem(clave);
  if(texto){const d=JSON.parse(texto);if(!Array.isArray(d.materiales)||!Array.isArray(d.movimientos))throw Error();estado={contador:0,...d};}
  else{estado=estadoInicial();localStorage.setItem(clave,JSON.stringify(estado));}
 }
 catch{bloqueado=true;mensaje("No se pudo leer o escribir el almacenamiento. Conserve/exporte su copia; no se sobrescribirá. Revise con el docente.","error");}
 function guardar(nuevo){if(bloqueado)throw Error("Almacenamiento bloqueado para conservar la copia.");localStorage.setItem(clave,JSON.stringify(nuevo));estado=nuevo;dibujar();}
 function elegido(){return estado.materiales.find(x=>x.id===el("k-material").value&&x.activo);}
 function seguro(fn){try{fn();}catch(e){mensaje(e.message||"No se pudo guardar. Conserve su estado anterior.","error");}}
 function dibujar(){
  const filtro=el("k-buscar").value.trim().toLocaleLowerCase(),previo=el("k-material").value;
  el("k-material").replaceChildren();
  const vacio=document.createElement("option");vacio.value="";vacio.textContent="Seleccione";el("k-material").append(vacio);
  const coincidencias=estado.materiales.filter(x=>x.activo&&(x.nombre.toLocaleLowerCase().includes(filtro)||x.id.toLocaleLowerCase().includes(filtro)));
  for(const m of coincidencias){const o=document.createElement("option");o.value=m.id;o.textContent=m.nombre+" · "+m.id;el("k-material").append(o);}
  // Si la selección anterior ya no coincide con la búsqueda, queda en «Seleccione»: no se actúa sobre ella.
  if([...el("k-material").options].some(x=>x.value===previo))el("k-material").value=previo;
  el("k-saldo").textContent=saldoDe(estado,el("k-material").value);
  el("k-filas").replaceChildren();
  for(const m of estado.movimientos){
   const mat=estado.materiales.find(x=>x.id===m.materialId),f=new Date(m.fecha);
   const tr=document.createElement("tr");
   for(const v of [isNaN(f)?m.fecha:f.toLocaleString("es-PE"),mat?mat.nombre+(mat.activo?"":" (inactivo)"):m.materialId,m.tipo,m.cantidad]){const td=document.createElement("td");td.textContent=v;tr.append(td);}
   el("k-filas").append(tr);
  }
  if(filtro&&coincidencias.length===0)mensaje("Sin coincidencias. Ningún dato fue modificado y no hay material seleccionado.");
 }
 el("k-buscar").addEventListener("input",()=>{mensaje("");dibujar();});
 el("k-material").addEventListener("change",()=>{el("k-saldo").textContent=saldoDe(estado,el("k-material").value);});
 el("k-material-form").addEventListener("submit",e=>{e.preventDefault();seguro(()=>{
  const nombre=el("k-nombre").value.trim();if(nombre.length<3)throw Error("Use al menos 3 caracteres.");
  if(nombreRepetido(estado,nombre,null))throw Error("Ya existe un material activo con ese nombre.");
  const c=nuevoCodigo(estado);
  guardar({...estado,contador:c.contador,materiales:[...estado.materiales,{id:c.codigo,nombre,activo:true}]});
  el("k-nombre").value="";mensaje("Material creado con código "+c.codigo+". Selecciónelo antes de registrar movimientos.","exito");
 });});
 el("k-mov-form").addEventListener("submit",e=>{e.preventDefault();seguro(()=>{
  const m=elegido();
  guardar(agregarMovimiento(estado,el("k-material").value,el("k-tipo").value,Number(el("k-cantidad").value),idMovimiento(),new Date().toISOString()));
  el("k-cantidad").value="";mensaje("Movimiento guardado. Existencia de "+m.nombre+": "+saldoDe(estado,m.id)+".","exito");
 });});
 el("k-renombrar").addEventListener("click",()=>seguro(()=>{
  const m=elegido();if(!m)throw Error("Seleccione material.");
  const nombre=prompt("Nuevo nombre",m.nombre);if(nombre===null){mensaje("Cambio de nombre cancelado. No se modificó nada.");return;}
  if(nombre.trim().length<3)throw Error("Use al menos 3 caracteres.");
  if(nombreRepetido(estado,nombre,m.id))throw Error("Ya existe un material activo con ese nombre.");
  guardar({...estado,materiales:estado.materiales.map(x=>x.id===m.id?{...x,nombre:nombre.trim()}:x)});
  mensaje("Nombre cambiado por id ("+m.id+"). Los demás materiales se conservan.","exito");
 }));
 el("k-retirar").addEventListener("click",()=>seguro(()=>{
  const m=elegido();if(!m)throw Error("Seleccione material.");
  const n=estado.movimientos.filter(x=>x.materialId===m.id).length,tiene=n>0;
  if(!confirm(tiene?"¿Inactivar «"+m.nombre+"»? Tiene "+n+" movimientos: se conserva su historial.":"¿Eliminar «"+m.nombre+"»? No tiene movimientos."))
   {mensaje("Acción cancelada. No se modificó nada.");return;}
  guardar({...estado,materiales:tiene?estado.materiales.map(x=>x.id===m.id?{...x,activo:false}:x):estado.materiales.filter(x=>x.id!==m.id)});
  mensaje(tiene?"Material inactivo. Historial conservado.":"Material sin movimientos eliminado.","exito");
 }));
 el("k-exportar").addEventListener("click",()=>{const b=new Blob([exportarCSV(estado)],{type:"text/csv;charset=utf-8;"}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download="movimientos-materiales.csv";a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);});
 dibujar();
}
if(typeof module!=="undefined")module.exports={saldoDe,agregarMovimiento,exportarCSV,nuevoCodigo,nombreRepetido,estadoInicial};
