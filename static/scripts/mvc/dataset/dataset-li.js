define("mvc/dataset/dataset-li",["exports","mvc/list/list-item","mvc/dataset/states","ui/fa-icon-button","mvc/base-mvc","utils/localization"],function(e,t,a,s,i,d){"use strict";function l(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(e,"__esModule",{value:!0});var n=l(t),r=l(a),o=l(s),u=l(i),p=l(d),f=n.default.ListItemView,c=f.extend({_logNamespace:"dataset",className:f.prototype.className+" dataset",id:function(){return["dataset",this.model.get("id")].join("-")},initialize:function(e){e.logger&&(this.logger=this.model.logger=e.logger),this.log(this+".initialize:",e),f.prototype.initialize.call(this,e),this.linkTarget=e.linkTarget||"_blank"},_setUpListeners:function(){f.prototype._setUpListeners.call(this);var e=this;return e.listenTo(e.model,{change:function(t){e.model.changedAttributes().state&&e.model.inReadyState()&&e.expanded&&!e.model.hasDetails()?e.model.fetch({silent:!0}).done(function(){e.render()}):_.has(t.changed,"tags")&&1===_.keys(t.changed).length?e.$(".nametags").html(e._renderNametags()):e.render()}})},_fetchModelDetails:function(){var e=this;return e.model.inReadyState()&&!e.model.hasDetails()?e.model.fetch({silent:!0}):jQuery.when()},remove:function(e,t){var a=this;e=e||this.fxSpeed,this.$el.fadeOut(e,function(){Backbone.View.prototype.remove.call(a),t&&t.call(a)})},_swapNewRender:function(e){return f.prototype._swapNewRender.call(this,e),this.model.has("state")&&this.$el.addClass("state-"+this.model.get("state")),this.$el},_renderPrimaryActions:function(){return[this._renderDisplayButton()]},_renderDisplayButton:function(){var e=this.model.get("state");if(e===r.default.NOT_VIEWABLE||e===r.default.DISCARDED||!this.model.get("accessible"))return null;var t={target:this.linkTarget,classes:"display-btn"};if(this.model.get("purged"))t.disabled=!0,t.title=(0,p.default)("Cannot display datasets removed from disk");else if(e===r.default.UPLOAD)t.disabled=!0,t.title=(0,p.default)("This dataset must finish uploading before it can be viewed");else if(e===r.default.NEW)t.disabled=!0,t.title=(0,p.default)("This dataset is not yet viewable");else{t.title=(0,p.default)("View data"),t.href=this.model.urls.display;var a=this;t.onclick=function(e){Galaxy.frame&&Galaxy.frame.active&&(Galaxy.frame.addDataset(a.model.get("id")),e.preventDefault())}}return t.faIcon="fa-eye",(0,o.default)(t)},_renderDetails:function(){if(this.model.get("state")===r.default.NOT_VIEWABLE)return $(this.templates.noAccess(this.model.toJSON(),this));var e=f.prototype._renderDetails.call(this);return e.find(".actions .left").empty().append(this._renderSecondaryActions()),e.find(".summary").html(this._renderSummary()).prepend(this._renderDetailMessages()),e.find(".display-applications").html(this._renderDisplayApplications()),this._setUpBehaviors(e),e},_renderSummary:function(){var e=this.model.toJSON(),t=this.templates.summaries[e.state];return(t=t||this.templates.summaries.unknown)(e,this)},_renderDetailMessages:function(){var e=this,t=$('<div class="detail-messages"></div>'),a=e.model.toJSON();return _.each(e.templates.detailMessages,function(s){t.append($(s(a,e)))}),t},_renderDisplayApplications:function(){return this.model.isDeletedOrPurged()?"":[this.templates.displayApplications(this.model.get("display_apps"),this),this.templates.displayApplications(this.model.get("display_types"),this)].join("")},_renderSecondaryActions:function(){switch(this.debug("_renderSecondaryActions"),this.model.get("state")){case r.default.NOT_VIEWABLE:return[];case r.default.OK:case r.default.FAILED_METADATA:case r.default.ERROR:return[this._renderDownloadButton(),this._renderShowParamsButton()]}return[this._renderShowParamsButton()]},_renderShowParamsButton:function(){return(0,o.default)({title:(0,p.default)("View details"),classes:"params-btn",href:this.model.urls.show_params,target:this.linkTarget,faIcon:"fa-info-circle",onclick:function(e){Galaxy.frame&&Galaxy.frame.active&&(Galaxy.frame.add({title:(0,p.default)("Dataset details"),url:this.href}),e.preventDefault(),e.stopPropagation())}})},_renderDownloadButton:function(){return this.model.get("purged")||!this.model.hasData()?null:_.isEmpty(this.model.get("meta_files"))?$('\n                <a class="download-btn icon-btn" href="'+this.model.urls.download+'" title="'+(0,p.default)("Download")+'">\n                    <span class="fa fa-floppy-o"></span>\n                </a>'):this._renderMetaFileDownloadButton()},_renderMetaFileDownloadButton:function(){var e=this.model.urls;return $('\n                <div class="metafile-dropdown dropdown">\n                    <a class="download-btn icon-btn" href="'+e.download+'" data-toggle="dropdown" title="'+(0,p.default)("Download")+'">\n                        <span class="fa fa-floppy-o"></span>\n                    </a>\n                    <ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">\n                        <li>\n                            <a href="'+e.download+'">\n                                '+(0,p.default)("Download dataset")+"\n                            </a>\n                        </li>\n                        "+_.map(this.model.get("meta_files"),function(t){return'<li>\n                                    <a href="'+(e.meta_download+t.file_type)+'">\n                                        '+(0,p.default)("Download")+" "+t.file_type+"\n                                    </a>\n                                </li>"})+"\n                    </ul>\n                </div>")},_renderNametags:function(){return _.template(["<% _.each(_.sortBy(_.uniq(tags), function(x) { return x }), function(tag){ %>",'<% if (tag.indexOf("name:") == 0){ %>','<span class="label label-info"><%- tag.slice(5) %></span>',"<% } %>","<% }); %>"].join(""))({tags:this.model.get("tags")})},events:_.extend(_.clone(f.prototype.events),{"click .display-btn":function(e){this.trigger("display",this,e)},"click .params-btn":function(e){this.trigger("params",this,e)},"click .download-btn":function(e){this.trigger("download",this,e)}}),toString:function(){return"DatasetListItemView("+(this.model?""+this.model:"(no model)")+")"}});c.prototype.templates=function(){var e=_.extend({},f.prototype.templates.warnings,{failed_metadata:u.default.wrapTemplate(['<% if( model.state === "failed_metadata" ){ %>','<div class="warningmessagesmall">',(0,p.default)("An error occurred setting the metadata for this dataset"),"</div>","<% } %>"]),error:u.default.wrapTemplate(["<% if( model.error ){ %>",'<div class="errormessagesmall">',(0,p.default)("There was an error getting the data for this dataset"),": <%- model.error %>","</div>","<% } %>"]),purged:u.default.wrapTemplate(["<% if( model.purged ){ %>",'<div class="purged-msg warningmessagesmall">',(0,p.default)("This dataset has been deleted and removed from disk"),"</div>","<% } %>"]),deleted:u.default.wrapTemplate(["<% if( model.deleted && !model.purged ){ %>",'<div class="deleted-msg warningmessagesmall">',(0,p.default)("This dataset has been deleted"),"</div>","<% } %>"])}),t=u.default.wrapTemplate(['<div class="details">','<div class="summary"></div>','<div class="actions clear">','<div class="left"></div>','<div class="right"></div>',"</div>","<% if( !dataset.deleted && !dataset.purged ){ %>",'<div class="tags-display"></div>','<div class="annotation-display"></div>','<div class="display-applications"></div>',"<% if( dataset.peek ){ %>",'<pre class="dataset-peek"><%= dataset.peek %></pre>',"<% } %>","<% } %>","</div>"],"dataset"),a=u.default.wrapTemplate(['<div class="details">','<div class="summary">',(0,p.default)("You do not have permission to view this dataset"),"</div>","</div>"],"dataset"),s={};s[r.default.OK]=s[r.default.FAILED_METADATA]=u.default.wrapTemplate(["<% if( dataset.misc_blurb ){ %>",'<div class="blurb">','<span class="value"><%- dataset.misc_blurb %></span>',"</div>","<% } %>","<% if( dataset.file_ext ){ %>",'<div class="datatype">','<label class="prompt">',(0,p.default)("format"),"</label>",'<span class="value"><%- dataset.file_ext %></span>',"</div>","<% } %>","<% if( dataset.metadata_dbkey ){ %>",'<div class="dbkey">','<label class="prompt">',(0,p.default)("database"),"</label>",'<span class="value">',"<%- dataset.metadata_dbkey %>","</span>","</div>","<% } %>","<% if( dataset.misc_info ){ %>",'<div class="info">','<span class="value"><%- dataset.misc_info %></span>',"</div>","<% } %>"],"dataset"),s[r.default.NEW]=u.default.wrapTemplate(["<div>",(0,p.default)("This is a new dataset and not all of its data are available yet"),"</div>"],"dataset"),s[r.default.NOT_VIEWABLE]=u.default.wrapTemplate(["<div>",(0,p.default)("You do not have permission to view this dataset"),"</div>"],"dataset"),s[r.default.DISCARDED]=u.default.wrapTemplate(["<div>",(0,p.default)("The job creating this dataset was cancelled before completion"),"</div>"],"dataset"),s[r.default.QUEUED]=u.default.wrapTemplate(["<div>",(0,p.default)("This job is waiting to run"),"</div>"],"dataset"),s[r.default.RUNNING]=u.default.wrapTemplate(["<div>",(0,p.default)("This job is currently running"),"</div>"],"dataset"),s[r.default.UPLOAD]=u.default.wrapTemplate(["<div>",(0,p.default)("This dataset is currently uploading"),"</div>"],"dataset"),s[r.default.SETTING_METADATA]=u.default.wrapTemplate(["<div>",(0,p.default)("Metadata is being auto-detected"),"</div>"],"dataset"),s[r.default.PAUSED]=u.default.wrapTemplate(["<div>",(0,p.default)('This job is paused. Use the "Resume Paused Jobs" in the history menu to resume'),"</div>"],"dataset"),s[r.default.ERROR]=u.default.wrapTemplate(["<% if( !dataset.purged ){ %>","<div><%- dataset.misc_blurb %></div>","<% } %>",'<span class="help-text">',(0,p.default)("An error occurred with this dataset"),":</span>",'<div class="job-error-text"><%- dataset.misc_info %></div>'],"dataset"),s[r.default.EMPTY]=u.default.wrapTemplate(["<div>",(0,p.default)("No data"),": <i><%- dataset.misc_blurb %></i></div>"],"dataset"),s.unknown=u.default.wrapTemplate(['<div>Error: unknown dataset state: "<%- dataset.state %>"</div>'],"dataset");var i={resubmitted:u.default.wrapTemplate(["<% if( model.resubmitted ){ %>",'<div class="resubmitted-msg infomessagesmall">',(0,p.default)("The job creating this dataset has been resubmitted"),"</div>","<% } %>"])},d=u.default.wrapTemplate(["<% _.each( apps, function( app ){ %>",'<div class="display-application">','<span class="display-application-location"><%- app.label %></span> ','<span class="display-application-links">',"<% _.each( app.links, function( link ){ %>",'<a target="<%- link.target %>" href="<%- link.href %>">',"<% print( _l( link.text ) ); %>","</a> ","<% }); %>","</span>","</div>","<% }); %>"],"apps");return _.extend({},f.prototype.templates,{warnings:e,details:t,noAccess:a,summaries:s,detailMessages:i,displayApplications:d})}(),e.default={DatasetListItemView:c}});