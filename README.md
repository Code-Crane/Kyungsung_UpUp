```
project-root/
├── app_ui/
│   ├── public/            
│   ├── src/               
│   │   ├── assets/        
│   │   ├── components/   
│   │   ├── pages/         
│   │   ├── services/      
│   │   ├── context/      
│   │   ├── App.jsx        
│   │   ├── main.jsx       
│   │   └── index.css     
│   ├── index.html         
│   ├── vite.config.js     
│   ├── package.json
│   └── README.md
├── app_server/
│   ├── main.py                  
│   ├── api/
│   │   ├── v1/
│   │   │   └── endpoints/
│   │   │       ├── file.py      
│   │   │       └── quiz.py      
│   │   └── v2/
│   │       └── endpoints/
│   │           ├── file.py      
│   │           └── quiz.py      
│   ├── uploads/                 
│   ├── core/
│   │   └── database.py              
│   ├── models/
│   │   └── file.py                  
│   ├── schemas/
│   │   ├── file.py                  
│   │   └── quiz.py                  
│   ├── services/
│   │   ├── file_service.py          
│   │   ├── quiz_service.py          
│   │   └── gpt_client.py            
│   ├── utils/
│   │   ├── file_parser.py           
│   │   └── extractors/
│   │   │   ├── pdf_extractor.py
│   │   │   ├── docx_extractor.py
│   │   │   ├── ppt_extractor.py
│   │   │   ├── txt_extractor.py
│   │   │   └── hwp_extractor.py
│   ├── .env
│   ├── requirements.txt 
│   └── README.md                                    
└── README.md
```
