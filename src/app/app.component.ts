import { Location } from '@angular/common'
import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgForm, FormControl } from '@angular/forms'
import { IconDefinition, faSearch, faDownload, faKey } from '@fortawesome/free-solid-svg-icons'
import { HttpClient, HttpHeaders } from '@angular/common/http'
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
  public accessToken: FormControl
  public searchIcon: IconDefinition
  public downloadIcon: IconDefinition
  public accessTokenIcon: IconDefinition
  public alert: string = ''
  public showAccessToken: boolean = false
  public issues = []
  public loading = false

  constructor(private location: Location, private route: ActivatedRoute, private http: HttpClient) { }

  fetchLocalStorage(){
    if (typeof(Storage) !== "undefined") {
      let token = localStorage.getItem('accessToken')      
      if(token){
        this.accessToken.setValue(token)
      }      
    } else {
      console.log('no support for local storage')
    }
  }

  pushLocalStorage(){
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem('accessToken', this.accessToken.value)
    } else {
      console.log('no support for local storage')
    }
  }

  ngOnInit() {    
    this.searchIcon = faSearch
    this.downloadIcon = faDownload
    this.accessTokenIcon = faKey
    this.searchString = new FormControl()    
    this.accessToken = new FormControl('')
    this.fetchLocalStorage()
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

  onSetAccessToken(){    
    this.showAccessToken = false
    this.pushLocalStorage()
  }

  setAccessToken(){
    this.showAccessToken = !this.showAccessToken
  }

  closeAlert(){
    this.alert = ''
  }

  performSearch() {
    let query = this.searchString.value ? this.searchString.value : ''
    this.location.go('/',`q=${query}`)
    this.alert = ''
    if(query !== ''){      
      this.loading = true
      let authHeaders = undefined
      if(this.accessToken.value !== ''){
        authHeaders = new HttpHeaders({'Authorization':`token ${this.accessToken.value}`})
      }
      this.http.get(`https://api.github.com/search/issues?per_page=100&q=${this.searchString.value}`, { observe : 'response', headers: authHeaders }).subscribe(response => {
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
      }, error => {
        this.issues = []
        this.loading = false
        this.alert = error.message
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
