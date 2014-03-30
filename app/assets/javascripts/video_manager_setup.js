Function.prototype.bind = function(obj,args) {
  var method = this,
    temp = function() {
      return method.call(obj, args);
    };

  return temp;
}

var video_manager = {

  counter : 0,
  callback : {},
  cfg : {},
  player : false,

  init : function(cfg) {

    this.cfg = cfg || {};
      if(!this.cfg.type || !this.cfg.q){
        this.message("We can't find anything, please provide search keywords, username or playlist ID.");
      }else{

        var script = document.createElement('script');
        script.setAttribute('id', 'jsonScript');
        script.setAttribute('type', 'text/javascript');

        //settings
        this.cfg.pagination = true;
        this.cfg.results = 6;
        this.cfg.thumbnail = 200;
        this.cfg.height = 280;
        this.cfg.width = 380;

        if(!this.cfg.start){
          this.cfg.start = 1;
        }

        switch(this.cfg.order){
          case "new_first":
            this.cfg.orderby = 'published';
            this.cfg.sortorder = 'ascending';
            break;

          case "highest_rating":
            this.cfg.orderby = 'rating';
            this.cfg.sortorder = 'descending';
            break;

          default:
            this.cfg.orderby = 'relevance';
            this.cfg.sortorder = 'descending';
            break;
        }

        switch(this.cfg.type){
          case "search":
            script.setAttribute('src', 'http://gdata.youtube.com/feeds/api/videos?q='+this.cfg.q+'&v=2&format=5&start-index='+this.cfg.start+'&max-results='+this.cfg.results+'&alt=jsonc&callback=video_manager.callback['+this.counter+']&orderby='+this.cfg.orderby+'&sortorder='+this.cfg.sortorder);
            break;

          case "user":
            script.setAttribute('src', 'http://gdata.youtube.com/feeds/api/users/'+this.cfg.q+'/uploads?max-results='+this.cfg.results+'&start-index='+this.cfg.start+'&alt=jsonc&v=2&format=5&callback=video_manager.callback['+this.counter+']&orderby='+this.cfg.orderby+'&sortorder='+this.cfg.sortorder);
            break;

          case "playlist":
            script.setAttribute('src', 'http://gdata.youtube.com/feeds/api/playlists/'+this.cfg.q+'?max-results='+this.cfg.results+'&start-index='+this.cfg.start+'&alt=jsonc&v=2&format=5&callback=video_manager.callback['+this.counter+']&sortorder='+this.cfg.sortorder);
            break;

          case "featured":
            script.setAttribute('src', 'http://gdata.youtube.com/feeds/api/standardfeeds/recently_featured?alt=jsonc&callback=video_manager.callback['+this.counter+']&max-results='+cfg.results+'&start-index='+this.cfg.start+'&v=2&format=5&orderby='+this.cfg.orderby+'&sortorder='+this.cfg.sortorder);
            break;

          case "filter":
            script.setAttribute('src', 'http://gdata.youtube.com/feeds/api/videos/?'+this.cfg.q+'&callback=video_manager.callback['+this.counter+']&max-results='+cfg.results+'&start-index='+this.cfg.start+'&alt=jsonc&v=2&format=5&orderby='+this.cfg.orderby+'&sortorder='+this.cfg.sortorder);
            break;
        }

        cfg.mC = this.counter;
        this.callback[this.counter] = function(json){
          video_manager.VideoList(json, cfg);
        }

        document.getElementsByTagName('head')[0].appendChild(script);

        this.counter++;
      }

  },


  VideoList: function(json, cfg){
    this.cfg = cfg;
    if(!this.cfg.player){
      this.cfg.player = 'embed';
    }
    if(!this.cfg.layout){
      this.cfg.layout = 'full';
    }

    var holderTag = document.getElementById(this.cfg.videoHolder);

    var children = holderTag.childNodes;
    for(var i = children.length; i > -1; i--){
      if(children[i] && (children[i].className.indexOf("error") !== -1 || children[i].tagName === "UL")){
        holderTag.removeChild(children[i]);
      }
    }


    if(json.error){
      this.message('An error occured:<br>'+json.error.message);
    }else if(json.data && json.data.items){
      var ul = document.createElement('ul');
      ul.className = 'video_list small-block-grid-1 medium-block-grid-3 large-block-grid-3';

      var playlist ="";

      for (var i = 0; i < json.data.items.length; i++) {
        var entry = json.data.items[i];

        if(entry.id){
          playlist += entry.id+",";
        }

        var li = document.createElement('li');
        var link = document.createElement('a');

        link.className = 'clip';

        if(this.cfg.player == 'embed' && (!entry.accessControl || entry.accessControl.embed == "allowed")){
          if(link.addEventListener){
            link.addEventListener('click', this.playVideo.bind(this, {'id': entry.id, 'cfg': cfg} ), false);
          }else if(link.attachEvent){
            link.attachEvent('onclick', this.playVideo.bind(this, {'id': entry.id, 'cfg': cfg}));
          }
        }else{
          link.setAttribute('href', entry.player["default"]);
        }

        var img = document.createElement('img');
        img.setAttribute('src', (entry.thumbnail ? entry.thumbnail.hqDefault : ''));
        link.appendChild(img);

        if(this.cfg.layout == 'thumbnails'){
          li.className = 'thumb';
          li.appendChild(a);
        }else{
          li.innerHTML = '<div class="video_item">' +
            '<div><h4>' + entry.title + '</h4></div>' +
            '<p class="description">' + this.formatDescription(entry.description) + '</p>' +
            '<p>By <a href="http://www.youtube.com/profile?user='+entry.uploader+'">' + entry.uploader + '</a></p>' +
            '<p><b>Duration:</b> ' + this.formatDuration(entry.duration) + '</p>' +
            '<p>' + entry.viewCount + ' <b>views</b></p>' +
            '<div class="small-12 text-center">' +
            '<a class="button bt-sky round small youtube_video" data-remote="true" data-method="put" href="' + window.location.pathname + '/add_to_basket?youtube_id=' + entry.id + '&name=' + entry.title + '">Add to video basket</a>' +
            '</div>';
          li.firstChild.firstChild.appendChild(link);
        }
        ul.appendChild(li);
      }

      holderTag.appendChild(ul);

      if(this.cfg.playlist == true){
        this.cfg.playerVars.playlist = playlist.substr(0, playlist.length - 1);
      }

      if(this.cfg.player == "embed" && this.cfg.display_first == true){
        if(json.data.items && json.data.items[0].video){
          PlayerParams.videoId = json.data.items[0].video.id;
        }else if(json.data.items){
          PlayerParams.videoId = json.data.items[0].id;
        }
        this.player = this.createPlayer(this.cfg);
      }

      if(this.cfg.pagination == true){
        this.cfg.display_first = false;
        var pul = document.createElement('ul');
        pul.setAttribute('class', 'video_pagination small-4 column');
        if(json.data.totalItems > (json.data.startIndex + json.data.itemsPerPage)){
          var li = document.createElement('li');
          var btnNext = document.createElement('a');
          btnNext.className = 'button bt-sky round left small';

          li.appendChild(btnNext);
          if(btnNext.addEventListener){
            btnNext.addEventListener('click', video_manager.loadNext.bind(this, {cfg: cfg} ),false);
          }else if(btnNext.attachEvent){
            btnNext.attachEvent('onclick', video_manager.loadNext.bind(this, {cfg: cfg}));
          }
          btnNext.innerHTML = 'Next';
          li.appendChild(btnNext);
          pul.appendChild(li);
        }

        if(json.data.startIndex > 1){
          var li = document.createElement('li');
          var btnPrev = document.createElement('a');
          btnPrev.className = 'button bt-sky round mlx small';

          if(btnPrev.addEventListener){
            btnPrev.addEventListener('click', video_manager.loadPrevious.bind(this, {cfg: cfg} ),false);
          }else if(btnPrev.attachEvent){
            btnPrev.attachEvent('onclick', video_manager.loadPrevious.bind(this, {cfg: cfg}));
          }
          btnPrev.innerHTML = 'Previous';
          li.appendChild(btnPrev);
          pul.appendChild(li);
        }

        holderTag.appendChild(pul);
      }

    }else{
      this.message('No YouTube videos found for your query:'+this.cfg.q+'\'');
    }
  },

  createPlayer : function(cfg){
    var holderTag = document.getElementById(cfg.videoHolder);
    var videoPlayer = document.createElement('div');
    videoPlayer.className = 'video_player';
    var iframe = document.createElement('iframe');

    iframe.setAttribute('id', cfg.videoHolder+'Player');
    iframe.setAttribute('width', cfg.width);
    iframe.setAttribute('height', cfg.height);
    iframe.setAttribute('frameBorder', '0');
    iframe.setAttribute('src', 'http://www.youtube.com/embed/'+PlayerParams.videoId+'?autoplay='+PlayerParams.autoplay+'&modestbranding=1');

    videoPlayer.appendChild(iframe);
    holderTag.insertBefore(videoPlayer, holderTag.firstChild);

    return iframe;
  },


  formatDuration : function(dr){
    return Math.floor(dr/60)+ ':'+dr % 60;
  },

  formatDescription : function(ds){
    if(ds.length > 255){
      return ds.substr(0, 252)+' ...';
    }else{
      return ds;
    }
  },


  formatDate : function(dt){
    if(dt){
      return dt.substr(0, 10)
    }else{
      return "unknown";
    }
  },

  loadNext : function(data){
    data.cfg.start = parseInt(data.cfg.start) + parseInt(data.cfg.results);
    video_manager.init(data.cfg);
  },

  loadPrevious : function(data){
    data.cfg.start = parseInt(data.cfg.start) - parseInt(data.cfg.results);
    if(data.cfg.start < 1) data.cfg.start = 1;
    video_manager.init(data.cfg);
  },

  playVideo : function(data){
    if(data.cfg.parent){
      var player = document.getElementById(data.cfg.parent+"Player");
    }else{
      var player = document.getElementById(data.cfg.videoHolder+"Player");
    }

    if(!player){
      PlayerParams.videoId = data.id;
      PlayerParams.autoplay = 1;
      this.createPlayer(data.cfg);
    }else{
      player.setAttribute('src', 'http://www.youtube.com/embed/'+data.id+'?autoplay=1&modestbranding=1&origin='+document.location.protocol+'//'+document.location.hostname);
    }
  },

  message: function(msg) {
    document.getElementById(video_manager.cfg.videoHolder).innerHTML = '<div class="error small-12 column">'+msg+'</div>';
  }
};

var PlayerParams = {
  autoplay: 0,
  modestbranding: 1,
  events: {
    'onReady': video_manager.onPlayerReady,
    'onStateChange': video_manager.onPlayerStateChange
  }
};
