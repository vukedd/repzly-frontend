import{R as z,ha as P,ia as A,ja as H,ka as g,na as V,pa as G}from"./chunk-4S3TJCHU.js";import{$ as I,$c as B,Ab as $,Gb as f,Hb as u,Jb as b,Kb as v,Lb as y,Pb as _,Qb as j,Rb as h,Uc as R,V as S,Va as i,Vb as p,W as F,Xb as d,Xc as w,Yb as s,Yc as O,Zc as N,ac as C,bc as Q,gb as E,hb as M,ia as T,ic as q,kb as k,mb as c,ua as x,vb as D,wb as r}from"./chunk-VGGSAUH7.js";var K=["header"],L=["title"],U=["subtitle"],W=["content"],X=["footer"],Y=["*",[["p-header"]],[["p-footer"]]],Z=["*","p-header","p-footer"];function ee(e,o){e&1&&y(0)}function te(e,o){if(e&1&&(f(0,"div",8),h(1,1),c(2,ee,1,0,"ng-container",6),u()),e&2){let t=_();i(2),r("ngTemplateOutlet",t.headerTemplate||t._headerTemplate)}}function ne(e,o){if(e&1&&(b(0),C(1),v()),e&2){let t=_(2);i(),Q(t.header)}}function ae(e,o){e&1&&y(0)}function ie(e,o){if(e&1&&(f(0,"div",9),c(1,ne,2,1,"ng-container",10)(2,ae,1,0,"ng-container",6),u()),e&2){let t=_();i(),r("ngIf",t.header&&!t._titleTemplate&&!t.titleTemplate),i(),r("ngTemplateOutlet",t.titleTemplate||t._titleTemplate)}}function re(e,o){if(e&1&&(b(0),C(1),v()),e&2){let t=_(2);i(),Q(t.subheader)}}function oe(e,o){e&1&&y(0)}function le(e,o){if(e&1&&(f(0,"div",11),c(1,re,2,1,"ng-container",10)(2,oe,1,0,"ng-container",6),u()),e&2){let t=_();i(),r("ngIf",t.subheader&&!t._subtitleTemplate&&!t.subtitleTemplate),i(),r("ngTemplateOutlet",t.subtitleTemplate||t._subtitleTemplate)}}function ce(e,o){e&1&&y(0)}function pe(e,o){e&1&&y(0)}function de(e,o){if(e&1&&(f(0,"div",12),h(1,2),c(2,pe,1,0,"ng-container",6),u()),e&2){let t=_();i(2),r("ngTemplateOutlet",t.footerTemplate||t._footerTemplate)}}var se=({dt:e})=>`
.p-card {
    background: ${e("card.background")};
    color: ${e("card.color")};
    box-shadow: ${e("card.shadow")};
    border-radius: ${e("card.border.radius")};
    display: flex;
    flex-direction: column;
}

.p-card-caption {
    display: flex;
    flex-direction: column;
    gap: ${e("card.caption.gap")};
}

.p-card-body {
    padding: ${e("card.body.padding")};
    display: flex;
    flex-direction: column;
    gap: ${e("card.body.gap")};
}

.p-card-title {
    font-size: ${e("card.title.font.size")};
    font-weight: ${e("card.title.font.weight")};
}

.p-card-subtitle {
    color: ${e("card.subtitle.color")};
}
`,me={root:"p-card p-component",header:"p-card-header",body:"p-card-body",caption:"p-card-caption",title:"p-card-title",subtitle:"p-card-subtitle",content:"p-card-content",footer:"p-card-footer"},J=(()=>{class e extends V{name="card";theme=se;classes=me;static \u0275fac=(()=>{let t;return function(n){return(t||(t=T(e)))(n||e)}})();static \u0275prov=S({token:e,factory:e.\u0275fac})}return e})();var fe=(()=>{class e extends G{header;subheader;set style(t){z(this._style(),t)||this._style.set(t)}styleClass;headerFacet;footerFacet;headerTemplate;titleTemplate;subtitleTemplate;contentTemplate;footerTemplate;_headerTemplate;_titleTemplate;_subtitleTemplate;_contentTemplate;_footerTemplate;_style=x(null);_componentStyle=I(J);getBlockableElement(){return this.el.nativeElement.children[0]}templates;ngAfterContentInit(){this.templates.forEach(t=>{switch(t.getType()){case"header":this._headerTemplate=t.template;break;case"title":this._titleTemplate=t.template;break;case"subtitle":this._subtitleTemplate=t.template;break;case"content":this._contentTemplate=t.template;break;case"footer":this._footerTemplate=t.template;break;default:this._contentTemplate=t.template;break}})}static \u0275fac=(()=>{let t;return function(n){return(t||(t=T(e)))(n||e)}})();static \u0275cmp=E({type:e,selectors:[["p-card"]],contentQueries:function(l,n,m){if(l&1&&(p(m,P,5),p(m,A,5),p(m,K,4),p(m,L,4),p(m,U,4),p(m,W,4),p(m,X,4),p(m,H,4)),l&2){let a;d(a=s())&&(n.headerFacet=a.first),d(a=s())&&(n.footerFacet=a.first),d(a=s())&&(n.headerTemplate=a.first),d(a=s())&&(n.titleTemplate=a.first),d(a=s())&&(n.subtitleTemplate=a.first),d(a=s())&&(n.contentTemplate=a.first),d(a=s())&&(n.footerTemplate=a.first),d(a=s())&&(n.templates=a)}},inputs:{header:"header",subheader:"subheader",style:"style",styleClass:"styleClass"},features:[q([J]),k],ngContentSelectors:Z,decls:9,vars:10,consts:[[3,"ngClass","ngStyle"],["class","p-card-header",4,"ngIf"],[1,"p-card-body"],["class","p-card-title",4,"ngIf"],["class","p-card-subtitle",4,"ngIf"],[1,"p-card-content"],[4,"ngTemplateOutlet"],["class","p-card-footer",4,"ngIf"],[1,"p-card-header"],[1,"p-card-title"],[4,"ngIf"],[1,"p-card-subtitle"],[1,"p-card-footer"]],template:function(l,n){l&1&&(j(Y),f(0,"div",0),c(1,te,3,1,"div",1),f(2,"div",2),c(3,ie,3,2,"div",3)(4,le,3,2,"div",4),f(5,"div",5),h(6),c(7,ce,1,0,"ng-container",6),u(),c(8,de,3,1,"div",7),u()()),l&2&&($(n.styleClass),r("ngClass","p-card p-component")("ngStyle",n._style()),D("data-pc-name","card"),i(),r("ngIf",n.headerFacet||n.headerTemplate||n._headerTemplate),i(2),r("ngIf",n.header||n.titleTemplate||n._titleTemplate),i(),r("ngIf",n.subheader||n.subtitleTemplate||n._subtitleTemplate),i(3),r("ngTemplateOutlet",n.contentTemplate||n._contentTemplate),i(),r("ngIf",n.footerFacet||n.footerTemplate||n._footerTemplate))},dependencies:[B,R,w,N,O,g],encapsulation:2,changeDetection:0})}return e})(),ke=(()=>{class e{static \u0275fac=function(l){return new(l||e)};static \u0275mod=M({type:e});static \u0275inj=F({imports:[fe,g,g]})}return e})();export{fe as a,ke as b};
//# sourceMappingURL=chunk-RSML4E5V.js.map
