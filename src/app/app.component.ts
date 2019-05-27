import { Location } from '@angular/common'
import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgForm, FormControl } from '@angular/forms'
import { IconDefinition, faSearch, faDownload } from '@fortawesome/free-solid-svg-icons'
import { HttpClient } from '@angular/common/http'
import * as moment from 'moment'
import { saveAs } from 'file-saver'

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [],
})
export class AppComponent {
  public searchString: FormControl
  public searchIcon: IconDefinition
  public downloadIcon: IconDefinition
  public issues = []
  public loading = false

  constructor(private location: Location, private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {    
    this.searchIcon = faSearch
    this.downloadIcon = faDownload
    this.searchString = new FormControl()
    this.route.queryParams.subscribe(params => {   
      if(params.q){         
        this.searchString.setValue(params.q)        
        this.performSearch()
      }
    })
  }

  onSearch(){    
    this.performSearch()    
  }

  performSearch() {
    let query = this.searchString.value ? this.searchString.value : ''
    this.location.go('/',`q=${query}`)
    if(query !== ''){      
      this.loading = true
      this.http.get(`https://api.github.com/search/issues?per_page=100&q=${this.searchString.value}`, { observe : 'response' }).subscribe(response => {
        let issues = (<any>response.body).items
        for(let i = 0, len = issues.length; i < len; i++) {
          issues[i].owner = issues[i].html_url.split('/')[3]
          issues[i].repo = issues[i].html_url.split('/')[4]
          issues[i].createdFromNow = moment(issues[i].created_at).fromNow()
          issues[i].updatedFromNow = moment(issues[i].updated_at).fromNow()
          if(issues[i].closed_at){
            issues[i].closedFromNow = moment(issues[i].closed_at).fromNow()
            issues[i].closedDuration = moment.duration(moment(issues[i].closed_at).diff(moment(issues[i].created_at))).humanize()
          }
          else{
            issues[i].closedFromNow = ""
          }
        }
        this.loading = false
        this.issues = issues        
      })
    }
    else{
      this.issues = []     
    }      
  }

  export() {
    if(this.issues.length > 0){
      var data = "IssueId;Owner;Repo;Number;Title;URL;Creator;State;Assignee;CreatedAt;UpdatedAt;ClosedAt\r\n";

      for(var i = 0, len = this.issues.length; i < len; i++) {
        let issue = this.issues[i]
        let assignee = "n/a"
        if(issue.assignee){
          assignee = issue.assignee.login
        }
        data += issue.id + ";" + issue.owner + ';' + issue.repo + ';' + issue.number + ';' +
          issue.title + ";" + issue.html_url + ';' + issue.user.login + ';' + issue.state + ";" + assignee + ';' +
          issue.created_at + ';' + issue.updated_at + ';' + issue.closed_at
        if(i < len - 1){
          data += "\r\n"
        }
      }      
      var blob = new Blob([data], {type: "text/csv;charset=utf-8"})
      saveAs(blob, "github-issues.csv")  
    }
  }

}
