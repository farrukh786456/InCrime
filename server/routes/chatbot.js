const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// ─── COMPREHENSIVE LEGAL KNOWLEDGE BASE ───────────────────────────────────
const KB = [
  {
    id: 'greet',
    keywords: ['hello','hi','hey','salam','assalam','السلام','help','start','begin','namaste','aoa','good morning','good evening','good afternoon'],
    answer: `السلام علیکم! I am InCrime Legal AI, your Pakistani law assistant.\n\nI can help you with:\n- Criminal Cases: Bail, FIR, Theft, Harassment, Challan\n- Family Cases: Nikah, Divorce, Custody, Dar-ul-Aman\n- Legal Document Generation (14 templates)\n- Court Procedures and Legal Rights\n- Cyber Crime and Online Harassment\n- Property Law and Inheritance\n\nType your legal question in English or Urdu and I will guide you step by step.`,
    followUp: ['How to file a bail application?','How to file an FIR?','What is Khula divorce?','What are my rights if arrested?','How to report cyber crime?','What is Dar-ul-Aman?'],
  },
  {
    id: 'bailPre',
    keywords: ['pre bail','pre-bail','anticipatory bail','before arrest','pre arrest bail','bail se pehle','قبل از گرفتاری','ضمانت قبل','anticipatory','گرفتاری سے پہلے','arrest hone se pehle'],
    answer: `Pre-Arrest Bail (Anticipatory Bail) - ضمانت قبل از گرفتاری\n\nPre-arrest bail is filed BEFORE you are arrested to prevent arrest.\n\nWhere to File:\n- Sessions Court for most cases\n- High Court if Sessions Court refuses\n\nRequired Information:\n- Your full name, father name, CNIC number\n- FIR number, date, and police station name\n- Sections (charges) you are facing\n- Strong reasons why bail should be granted\n- Advocate name and address\n\nKey Legal Sections:\n- Section 498 CrPC: Pre-arrest bail power\n- Section 497 CrPC: General bail provisions\n\nImportant Steps:\n1. File as soon as you learn FIR is registered against you\n2. Hire a qualified advocate immediately\n3. Gather supporting evidence and witnesses\n4. If bail is refused, go to High Court immediately\n\nUse InCrime to generate your Pre-Arrest Bail Application under Create Application menu.`,
    followUp: ['What documents are needed for bail?','What is post-arrest bail?','What if bail is rejected?','How long does bail take?','What is surety in bail?'],
  },
  {
    id: 'bailPost',
    keywords: ['post bail','post-arrest','after arrest','bail after','بعد از گرفتاری','ضمانت بعد','arrested','گرفتار','police ne pakra','custody','jail mein','جیل میں','lock up','detained','remand'],
    answer: `Post-Arrest Bail - ضمانت بعد از گرفتاری\n\nPost-arrest bail is filed AFTER you have been arrested to secure release from custody.\n\nWhere to File:\n- Magistrate Court for bailable offences\n- Sessions Court for non-bailable offences\n- High Court if Sessions Court rejects\n\nRequired Documents:\n- FIR copy\n- Arrest memo\n- CNIC of accused and surety (guarantor)\n- Property documents of surety\n- Medical certificate if health issue\n\nBailable vs Non-Bailable:\n- Bailable offences: Bail is your right, Magistrate must give it\n- Non-bailable offences: Judge decides based on arguments\n\nStrong Grounds for Bail:\n- No previous criminal record\n- Accused is breadwinner of family\n- Medical emergency or serious illness\n- Evidence against accused is weak\n- Investigation is already complete\n- Not a flight risk\n\nTimeline:\n- Must appear before Magistrate within 24 hours of arrest\n- Bail hearing usually within 2 to 7 days\n\nGenerate your Post-Arrest Bail Application on InCrime now.`,
    followUp: ['What is surety in bail?','Can bail be cancelled after granting?','How much surety is needed?','What if bail is rejected by Sessions Court?','How to get bail quickly?'],
  },
  {
    id: 'bail',
    keywords: ['bail','ضمانت','release from jail','release from custody','bond','مچلکہ','bail application','bail kaise milti','ضمانت کیسے','bail types','types of bail'],
    answer: `Bail in Pakistan - Complete Guide\n\nTypes of Bail:\n1. Pre-Arrest Bail: Filed before arrest (Section 498 CrPC)\n2. Post-Arrest Bail: Filed after arrest (Section 497 CrPC)\n3. Interim Bail: Temporary bail during hearing process\n4. Statutory Bail: Automatically granted if investigation takes too long\n\nCourts That Grant Bail:\n- Magistrate: Minor or bailable cases\n- Sessions Judge: Most criminal cases\n- High Court: Complex or rejected cases\n- Supreme Court: Last resort\n\nWhat Courts Consider:\n- Nature and gravity of offence\n- Accused past criminal history\n- Is accused a flight risk\n- Risk to witnesses or community\n- Status of investigation\n\nSurety Requirements:\n- One to two sureties (guarantors) required\n- Must be local residents with property\n- CNIC and property documents needed\n- Property value should match bail amount\n\nCost:\n- Court bail itself is free\n- Lawyer fee ranges from Rs 5000 to Rs 50000 depending on case\n\nUse InCrime to generate Pre-Bail or Post-Bail application instantly.`,
    followUp: ['How to file pre-arrest bail?','How to file post-arrest bail?','What is surety in bail?','Can bail be cancelled?','What if bail is rejected at every court level?'],
  },
  {
    id: 'fir',
    keywords: ['fir','first information report','report crime','مقدمہ','درج مقدمہ','complaint to police','پولیس رپورٹ','police station','تھانہ','fir nahi','fir refuse','case register','police refused','police report','file complaint'],
    answer: `FIR - First Information Report - ایف آئی آر\n\nFIR is the first complaint registered at a police station that officially starts a criminal case.\n\nHow to File FIR Step by Step:\n1. Go to the nearest police station\n2. Ask to meet the SHO (Station House Officer)\n3. Tell the full story of the incident clearly\n4. Provide names of accused if you know them\n5. Police must register FIR and give you a free copy\n\nInformation to Include in FIR:\n- Date, time, and exact place of incident\n- Full description of what happened\n- Name or description of accused\n- Names and contacts of witnesses\n- List of stolen items if theft\n- Injuries sustained if assault\n\nIf Police Refuse to Register FIR:\n1. Complain to DSP (Deputy Superintendent of Police)\n2. File application before Judicial Magistrate under Section 22-A CrPC\n3. Send written complaint to SSP or DIG by registered post\n4. Use Pakistan Citizen Portal at www.citizenportal.gov.pk\n5. File Constitutional Petition in High Court\n\nKey Law: Section 154 CrPC - Police are legally obligated to register FIR.\n\nInCrime can help you draft FIR and related applications.`,
    followUp: ['What if police refuse to register FIR?','Can FIR be cancelled once filed?','What happens after FIR is registered?','What is the difference between FIR and complaint?','How to get FIR copy?'],
  },
  {
    id: 'theft',
    keywords: ['theft','stolen','robbery','چوری','ڈکیتی','rob','steal','burglar','snatching','mobile stolen','phone stolen','car stolen','laptop stolen','money stolen','purse snatched','snatch','ghar mein chori','house robbery','dacoity','ڈاکہ'],
    answer: `Theft and Robbery - Legal Guide - چوری اور ڈکیتی\n\nTypes of Theft Offences Under PPC:\n- Theft Section 378: Secretly taking property, up to 3 years\n- Robbery Section 390: Theft with violence or threat, up to 10 years\n- Dacoity Section 391: Robbery by 5 or more persons, life imprisonment\n- Snatching: Mobile or purse snatching, 3 to 7 years\n\nImmediate Steps After Theft or Robbery:\n1. Go to police station immediately\n2. File FIR and describe everything in detail\n3. List all stolen items with value and serial numbers\n4. Give description of accused if you saw them\n5. Give witness names if any\n6. Collect FIR copy for yourself\n\nInformation Needed for Complaint:\n- Your name, CNIC, address, mobile number\n- Date, time, exact location of incident\n- Description of all stolen items\n- Mobile IMEI number (check using star hash 06 hash)\n- Description of accused such as face, height, clothes\n- Witness names and contact numbers\n\nAfter Filing FIR:\n- Follow up with investigating officer regularly\n- Get case diary number from police\n- If police not acting, apply to SSP\n\nGenerate Theft or FIR Application on InCrime instantly.`,
    followUp: ['What if police do not investigate properly?','How to track stolen mobile in Pakistan?','What is the punishment for dacoity?','What proof is needed for theft case?','Can I claim insurance after theft?'],
  },
  {
    id: 'harassment',
    keywords: ['harassment','harass','abuse','تنگ','ہراساں','sexual harassment','workplace harassment','cyber harassment','دھمکی','پریشان','stalking','blackmail','بلیک میل','threat','دھمکانا','mental torture','eve teasing','molest','tease','inappropriate'],
    answer: `Harassment - Legal Protection Guide - ہراسانی\n\nTypes of Harassment Covered by Law:\n- Sexual Harassment at Workplace\n- Street Harassment and Eve Teasing\n- Physical and Mental Harassment\n- Cyber Harassment including Online Threats\n- Stalking\n- Blackmail and Extortion\n- Domestic Harassment\n\nKey Laws and Penalties:\n- Section 509 PPC: Insult modesty, 2 years plus fine\n- Section 506 PPC: Criminal threats, 2 to 7 years\n- Workplace Harassment Act 2010: Complaint to Ombudsman\n- PECA 2016 Section 24: Cyber harassment, 3 years plus Rs 1 million fine\n\nHow to Report:\n1. File FIR at nearest police station\n2. For workplace: Complain to Federal Ombudsman\n3. For online harassment: FIA Cybercrime at 0800-02345\n4. Apply for Protection Order in court\n\nEvidence to Collect:\n- Screenshots of all messages and posts with date and time\n- Record calls with knowledge of other party\n- Witness statements\n- Medical reports if physically harmed\n- Write down dates, times, and places of all incidents\n\nProtection Order:\n- Court can order harasser to stay away from you\n- Violation of order means immediate arrest\n- Can be granted urgently within days\n\nGenerate Harassment Application on InCrime.`,
    followUp: ['How to get court protection order?','What is cyber harassment law PECA?','How to complain about workplace harassment?','Can I file FIR for online threats?','What evidence is needed for harassment case?'],
  },
  {
    id: 'divorce',
    keywords: ['divorce','talaq','khula','خلع','طلاق','separation','علیحدگی','dissolve marriage','faskh','فسخ','divorce kaise','how to divorce','wife want divorce','husband giving talaq','talaq dena','talaq lena','divorce procedure'],
    answer: `Divorce in Pakistan - Complete Legal Guide\n\n3 Types of Divorce:\n\n1. Talaq by Husband:\n- Husband says or writes Talaq\n- Must send written notice to Union Council within 30 days\n- 90 day reconciliation period (Iddat) begins\n- If no reconciliation, divorce is final after 90 days\n- Register certificate at Union Council\n\n2. Khula by Wife Through Court:\n- Wife files petition in Family Court\n- Usually wife returns Mehr amount\n- Grounds include cruelty, non-maintenance, desertion, impotency, or imprisonment\n- Court issues Khula decree in 3 to 6 months\n\n3. Judicial or Faskh by Court:\n- Either party applies to court\n- Based on serious proven grounds\n- Court investigates and issues decree\n\nRequired Documents:\n- Nikah Nama (marriage certificate)\n- CNIC copies of both parties\n- Marriage witnesses details\n- For Khula: grounds with supporting proof\n\nAfter Divorce:\n- Wife must observe Iddat for 3 months or 3 menstrual cycles\n- Mehr must be paid by husband if not already paid\n- Child custody is decided separately by court\n- Husband must pay Mutaa (compensation) if giving Talaq\n\nInCrime has divorce-related application templates available.`,
    followUp: ['How to file Khula petition in court?','What is Mehr and does husband pay after divorce?','What happens to children after divorce?','How long does Khula take?','Can husband refuse to give Talaq?'],
  },
  {
    id: 'nikah',
    keywords: ['nikah','marriage','شادی','نکاح','nikah nama','نکاح نامہ','wedding','marriage certificate','marriage registration','mehr','مہر','wali','ولی','court marriage','nikah without wali','dulha','dulhan'],
    answer: `Nikah and Marriage Registration in Pakistan\n\nNikah Nama is the official legal document for Muslim marriage registration.\n\nRequirements for Valid Nikah:\n- Both parties must be freely willing with no force or coercion\n- Wali (guardian) for bride such as father or brother\n- Two male witnesses or one male and two female witnesses\n- Mehr (dower) agreed upon and clearly stated\n- Licensed Nikah Registrar present\n- Registered with Union Council within 30 days\n\nInformation in Nikah Nama:\n- Full names, ages, and CNICs of bride and groom\n- Father name of both parties\n- Wali name and relationship\n- Mehr amount whether immediate or deferred\n- Witnesses names and CNICs\n- Date, time, and place of Nikah\n- Nikah Registrar signature and official seal\n\nRegistration Process:\n1. Nikah performed by registered Nikah Khwan\n2. All parties sign Nikah Nama\n3. Original filed at Union Council\n4. Certified copies given to both families\n5. Must be done within 30 days of Nikah\n\nMehr (Dower):\n- Compulsory gift from husband to wife\n- Agreed before Nikah ceremony\n- Wife owns it completely as her property\n- Must be paid on demand or as agreed\n\nGenerate Nikah Nama form on InCrime instantly.`,
    followUp: ['What is Mehr and how much should it be?','How to register Nikah at Union Council?','What if Nikah Nama is lost?','Is court marriage valid in Pakistan?','What is second marriage law?'],
  },
  {
    id: 'custody',
    keywords: ['custody','child custody','بچے','بچوں کی حضانت','guardian','guardianship','حضانت','parental rights','mother custody','father custody','minor','نابالغ','custody after divorce','who gets children','bache kis ko milay ge','children after separation'],
    answer: `Child Custody in Pakistan - Legal Guide\n\nGoverning Law: Guardians and Wards Act 1890 and Muslim Family Laws Ordinance 1961\n\nDefault Custody Rules (Hizanat):\n\nMother gets custody of:\n- Sons until age 7 years\n- Daughters until they reach puberty around age 12 to 13\n\nFather gets custody after:\n- Son turns 7 years old\n- Daughter reaches puberty\n\nNote: Court always decides based on the child best interest above all rules\n\nMother Loses Custody If:\n- She remarries someone outside child mahram family\n- She is declared unfit due to immoral behavior or addiction\n- She cannot properly care for the child\n- She relocates far away without court permission\n\nFather Must Always Pay Regardless of Custody:\n- Monthly maintenance covering food, clothing, and education\n- All medical expenses\n- These obligations continue regardless of who has custody\n\nHow to File Custody Application:\n1. File petition in Family Court\n2. Attach child birth certificate\n3. Provide proof of financial stability\n4. Show your living environment and home conditions\n5. Get character witness statements\n6. Court may interview child if old enough\n7. Court issues custody order\n\nVisitation Rights:\n- Non-custodial parent has right to regular visits\n- Court sets visitation schedule\n- Violation of court order is contempt of court\n\nGenerate Child Custody Application on InCrime.`,
    followUp: ['Can mother take child abroad without father permission?','What if father does not pay child maintenance?','How to change custody order?','Can grandparents get custody?','What is joint custody?'],
  },
  {
    id: 'darulaman',
    keywords: ['darul aman','dar ul aman','dar-ul-aman','دارالامان','shelter home','women shelter','release darul','meeting darul','sending darul','پناہ گاہ','خواتین شیلٹر','shelter ke liye','protect wife'],
    answer: `Dar-ul-Aman - Women Shelter Home Guide\n\nWhat is Dar-ul-Aman?\nGovernment-run shelter homes providing protection to women in distress including domestic violence victims, women in unsafe situations, or those needing emergency protection.\n\n3 Types of Applications Available on InCrime:\n\n1. Sending to Dar-ul-Aman:\n- When a woman needs immediate protection\n- Court order is required\n- Woman must give her own consent\n- Family or police can apply\n\n2. Meeting at Dar-ul-Aman:\n- Family wants to meet woman in shelter\n- Court permission is required\n- Woman consent must be verified by court\n- Husband, father, or brother can apply\n\n3. Release from Dar-ul-Aman:\n- Woman or family applies for release\n- Court verifies her safety situation\n- Woman own statement is crucial for court decision\n- Court issues release order\n\nDocuments Needed:\n- Your CNIC and relationship proof to the woman\n- Application clearly stating reason\n- Court petition with full cause explained\n\nEmergency Dar-ul-Aman Access:\n- Contact nearest police station\n- Call 1043 Punjab Women Helpline\n- No court order needed for emergency entry\n\nGenerate all 3 Dar-ul-Aman applications on InCrime.`,
    followUp: ['How to get woman released from Dar-ul-Aman?','Can husband visit wife in Dar-ul-Aman?','What documents are needed?','Is Dar-ul-Aman free of cost?','How long can a woman stay in Dar-ul-Aman?'],
  },
  {
    id: 'challan',
    keywords: ['challan','چالان','charge sheet','police challan','traffic challan','court challan','پیشی','summons','court summons','challan kya hai','what is challan'],
    answer: `Challan - Legal Guide - پولیس چالان\n\nWhat is Police Challan?\nAfter FIR and investigation, police file a challan (charge sheet) in court formally charging the accused. This officially starts the court trial process.\n\nTypes of Challan:\n- Complete Challan: Sufficient evidence collected and accused is arrested\n- Incomplete Challan: Investigation is still ongoing\n- Supplementary Challan: New evidence or additional accused added later\n\nChallan Contains:\n- Name and full details of accused\n- Sections and charges being filed\n- Complete list of witnesses\n- Evidence collected during investigation\n- Investigation summary and findings\n\nTraffic Challan:\n- Issued for traffic violations like speeding, wrong parking, no seatbelt, no license\n- Pay at designated bank or online through traffic police portal\n- Unpaid challans lead to license suspension\n\nYour Rights When Challan Filed Against You:\n- Right to receive a copy of challan\n- Right to have a defense lawyer\n- Right to know exact charges against you\n- Right to apply for bail\n- Right to challenge prosecution witnesses\n\nIf Police Delay Filing Challan:\n- File application in court asking judge to direct police\n- Court can direct police to submit challan immediately\n\nGenerate Challan Application on InCrime.`,
    followUp: ['What happens after challan is filed in court?','Can I challenge a false challan?','What is difference between FIR and challan?','How to apply for bail after challan?','What is acquittal?'],
  },
  {
    id: 'maintenance',
    keywords: ['maintenance','nafaqa','نفقہ','alimony','husband not paying','child support','financial support','guzara','گزارہ','living expenses','food not given','kharcha nahi deta','maintenance claim','wife maintenance','children maintenance','nafqa'],
    answer: `Maintenance (Nafaqa) - Complete Guide - نفقہ\n\nWho is Entitled to Maintenance:\n- Wife: During marriage and 3 months after divorce (Iddat period)\n- Children: Until son earns independently, daughter until she marries\n- Parents: If they are unable to support themselves\n\nWife Rights:\n- Husband must provide food, shelter, clothing, and basic needs\n- Continues throughout marriage regardless of wife wealth\n- Continues during Iddat period (3 months after divorce)\n- Amount is based on husband income and financial capacity\n\nChild Maintenance:\n- Father must pay even if mother has custody of children\n- Covers food, clothing, school fees, and medical expenses\n- For son: until he earns independently\n- For daughter: until she gets married\n\nHow to Claim Maintenance:\n1. File maintenance suit in Family Court\n2. Show marriage certificate or relationship proof\n3. Show proof of husband income such as salary slip or property\n4. Court fixes monthly maintenance amount\n5. Court order must be followed or face consequences\n\nIf Husband Refuses to Pay:\n- Court can attach (seize) his monthly salary\n- Court can freeze his bank accounts\n- Court can seize his property\n- Willful non-payment can lead to imprisonment\n\nInterim Maintenance:\n- Court grants temporary maintenance quickly\n- Available while main case is still proceeding\n\nAsk InCrime to help you draft your maintenance application.`,
    followUp: ['How much maintenance am I entitled to?','Can wife claim maintenance without divorce?','How to enforce maintenance order?','What if husband hides his income?','Can maintenance amount be increased later?'],
  },
  {
    id: 'rights',
    keywords: ['rights','حق','legal rights','rights if arrested','prisoner rights','accused rights','fundamental rights','constitution','آئین','قانونی حقوق','citizen rights','what are my rights','mera haq'],
    answer: `Legal Rights of Citizens in Pakistan\n\nConstitutional Fundamental Rights:\n- Article 9: Right to life and liberty, no one can take your freedom without law\n- Article 10: Rights of accused, must be told charges immediately\n- Article 10-A: Right to fair trial\n- Article 14: Dignity of person, no torture allowed under any circumstances\n- Article 25: Equality before law, everyone is equal\n\nYour Rights If Arrested:\n- Must be told reason for arrest immediately\n- Right to remain silent\n- Right to contact family and lawyer within 24 hours\n- Must be brought before Magistrate within 24 hours of arrest\n- Right to bail in bailable offences\n- Right to free lawyer if you cannot afford one\n- Protection from torture and inhuman treatment\n\nRights During Police Investigation:\n- Right to copy of FIR\n- Right not to be a witness against yourself\n- Right to medical examination if claiming torture\n- Right to have lawyer present during questioning\n\nRights During Court Trial:\n- Right to know all charges against you\n- Right to cross-examine prosecution witnesses\n- Right to call your own defense witnesses\n- Right to present your full defense\n- Right to appeal any conviction\n\nEmergency Contacts:\n- Police Emergency: 15\n- FIA Cybercrime: 0800-02345\n- Legal Aid Punjab: 0800-09008\n- Women Helpline: 1043`,
    followUp: ['What to do if police torture me?','What is right to fair trial?','How to complain against police?','What is legal aid in Pakistan?','Can police search my house without warrant?'],
  },
  {
    id: 'cyber',
    keywords: ['cyber','online fraud','social media','facebook','whatsapp','hacking','fake account','cybercrime','peca','internet crime','online harassment','blackmail online','intimate images','screenshot','threat online','video leak','deepfake','scam online','fia cybercrime'],
    answer: `Cyber Crime Law in Pakistan - PECA 2016\n\nPrevention of Electronic Crimes Act 2016\n\nOffences and Punishments:\n- Online Harassment Section 24: 3 years plus Rs 1 million fine\n- Cyber Stalking Section 24: 3 years plus fine\n- Fake Account or Impersonation Section 16: 3 years plus Rs 500,000\n- Sharing Intimate Images Section 21: 5 years plus Rs 5 million fine\n- Hacking Section 3: 3 years plus Rs 500,000\n- Online Fraud Section 14: 3 years plus Rs 500,000\n- Hate Speech Online Section 11: 7 years plus fine\n\nHow to Report Cyber Crime:\n\nFIA Cyber Crime Wing is the Primary Authority:\n- Hotline: 0800-02345 (Free, available 24 hours 7 days)\n- Online: www.fia.gov.pk\n- Email: ccrc@fia.gov.pk\n- Visit nearest FIA office in your city\n\nAlso Report To:\n- Pakistan Citizen Portal at www.citizenportal.gov.pk\n- Local police station for FIR\n- Report directly to platform such as Facebook or WhatsApp\n\nEvidence to Save Immediately:\n- Screenshot everything with date and time visible\n- Save the URL or link of content\n- Do not delete any messages or posts\n- Note all email addresses and account names\n- Secure your accounts by changing passwords immediately\n\nInCrime can help you draft cybercrime complaint applications.`,
    followUp: ['How to report fake Facebook account?','What to do if someone shares my private photos?','How to contact FIA Cybercrime?','Is online blackmail a crime in Pakistan?','How to get court order to remove online content?'],
  },
  {
    id: 'domesticViolence',
    keywords: ['domestic violence','wife beating','husband beats','marta hai','marpit','family violence','گھریلو تشدد','beating','مار پیٹ','physical abuse','violence at home','abuse by husband','wife abuse','hurt at home','dv case','domestic abuse'],
    answer: `Domestic Violence - Immediate Legal Help\n\nIf you are in danger right now call 15 (Police Emergency) immediately.\n\nLaws That Protect You:\n- Punjab Protection of Women Against Violence Act 2016\n- Sindh Domestic Violence Act 2013\n- KPK Domestic Violence Act 2021\n- PPC Sections 337, 341, 352 covering Assault and Hurt\n\nWhat Counts as Domestic Violence:\n- Physical beating and assault\n- Emotional and psychological abuse\n- Economic abuse such as not providing money\n- Threats of violence\n- Forced isolation from family\n- Controlling and intimidating behavior\n\nImmediate Steps to Take:\n1. Call 15 (Police Emergency) if in immediate danger\n2. Go to Dar-ul-Aman shelter home, no paperwork needed immediately\n3. Get medical treatment and keep the medical report as evidence\n4. Photograph all injuries clearly\n5. Apply for Protection Order in court\n\nProtection Order from Court:\n- Prohibits abuser from contacting or approaching you\n- Can remove abuser from your home legally\n- Granted within 24 hours in emergency situations\n- Violation of order results in immediate arrest of abuser\n\nEmergency Helplines:\n- Police Emergency: 15\n- Women Helpline: 1043\n- Edhi Foundation: 115\n- Umang Helpline: 0317-4288665\n- Rozan Counseling: 051-2602430`,
    followUp: ['How to get Protection Order from court?','How to go to Dar-ul-Aman?','Can I take my children when I leave?','Will police help for domestic violence?','What medical evidence is needed?'],
  },
  {
    id: 'property',
    keywords: ['property','جائیداد','land','زمین','inheritance','وراثت','will','وصیت','ownership','ملکیت','mutation','انتقال','registry','ghar','makan','zameen','fard','encroachment','qabza','illegal occupation','property dispute'],
    answer: `Property and Land Law in Pakistan\n\nCommon Property Disputes:\n- Illegal occupation (Qabza)\n- Fraudulent sale or transfer\n- Inheritance disputes between heirs\n- Joint property partition between family members\n- Boundary disputes with neighbors\n\nIslamic Inheritance Shares Applied Automatically:\n- Wife: 1 of 8 share if children exist, or 1 of 4 share if no children\n- Daughter: Half of son share\n- Mother: 1 of 6 or 1 of 3 depending on situation\n- Son: Double the share of daughter\n\nIf Property is Illegally Occupied:\n1. File civil suit for possession in Civil Court\n2. File FIR if criminal encroachment or force was used\n3. Apply for Injunction (Stay Order) to stop any sale\n4. Complain to Revenue or PLRA authorities\n\nProperty Documents Needed:\n- Fard: Ownership record obtained from Patwari\n- Registry: Sale deed from Sub-Registrar office\n- Mutation or Intiqal: Transfer of ownership record\n- CNIC of owner\n\nCheck Land Records Online:\n- Punjab: www.lrmis.gop.pk\n- Sindh: www.sindhlands.gov.pk\n- KPK: www.kplands.gov.pk\n\nRegistry Fraud:\n- File FIR for forgery under Section 420 and 467 PPC\n- Apply to civil court to cancel fraudulent registry`,
    followUp: ['How to claim inheritance share?','How to stop illegal sale of my property?','What is Fard and how to get it?','How to transfer property after owner dies?','What is mutation and why is it important?'],
  },
  {
    id: 'police',
    keywords: ['police complaint','police brutality','police torture','corrupt police','police not helping','شکایت پولیس','پولیس کے خلاف','complaint against police','police corruption','abuse of power','police demanding bribe','police ne mara','police harassment'],
    answer: `Complaint Against Police in Pakistan\n\nIf Police Are Corrupt, Not Helping, or Abusing Power:\n\nStep 1: Internal Police Complaints:\n- Against constable: Complain to SHO\n- Against SHO: Complain to DSP\n- Against DSP: Complain to SSP or SP\n- Against SSP: Complain to DIG or IGP\n\nStep 2: Government Portals:\n- Pakistan Citizen Portal at www.citizenportal.gov.pk\n- PM Portal by calling or SMS to 1201\n- IGP Office Online Complaint system\n\nStep 3: Judicial Remedies:\n- File complaint before Judicial Magistrate\n- File Constitutional Petition (Article 199) in High Court\n- Contact Human Rights Cell of Supreme Court of Pakistan\n\nStep 4: If Police Tortured You:\n- Demand medical examination immediately\n- Photograph all injuries\n- Get witness statements\n- File Constitutional Petition in High Court\n- Torture is illegal under Anti-Torture Act 2022\n- Seek protection under Article 14 of Constitution\n\nOversight Bodies:\n- Human Rights Commission of Pakistan: 051-9214871\n- National Commission on Human Rights: 051-9204374\n- FIA handles complaints against federal police officers\n\nNote: Demanding bribe by police officer is a crime under Section 161 PPC.`,
    followUp: ['How to file petition in High Court against police?','What is a writ petition?','Can a police officer be arrested?','How to contact the IGP?','What is the Anti-Torture Act?'],
  },
  {
    id: 'court',
    keywords: ['court','عدالت','trial','judge','جج','hearing','پیشی','court procedure','how court works','magistrate','sessions court','high court','supreme court','court process','case procedure','lawsuit','civil court','family court'],
    answer: `Pakistani Court System - How It Works\n\nCourt Hierarchy from Low to High:\n1. Civil Judge or Judicial Magistrate: Minor civil and criminal cases\n2. Sessions Court: Major criminal cases\n3. High Court: Appeals and Constitutional writs\n4. Supreme Court: Final court of appeal in Pakistan\n\nSpecial Courts:\n- Family Court: Divorce, custody, maintenance, and Nikah matters\n- Anti-Terrorism Court: Terrorism related cases\n- Banking Court: Cheque dishonour and loan cases\n- Accountability Court: NAB and corruption cases\n\nCriminal Case Journey:\n1. FIR is Filed\n2. Police Investigation begins\n3. Challan filed in Court\n4. Bail application if needed\n5. Charges formally framed\n6. Trial with witnesses and evidence\n7. Final arguments by both sides\n8. Judgment announced (Conviction or Acquittal)\n9. Appeal if convicted\n\nCivil Case Journey:\n1. Plaint (lawsuit) filed\n2. Court issues notice to defendant\n3. Defendant files Written Statement\n4. Evidence and witnesses presented\n5. Final arguments\n6. Decree issued by court\n7. Execution of decree\n\nRealistic Timelines:\n- Bail application: Days to 2 weeks\n- Family case: 6 months to 2 years\n- Criminal trial: 1 to 5 years\n- Civil case: 2 to 7 years\n- High Court appeal: 1 to 3 years`,
    followUp: ['What is difference between civil and criminal case?','How to appeal against court decision?','What is a writ petition?','How much do courts cost?','What is contempt of court?'],
  },
  {
    id: 'lawyer',
    keywords: ['lawyer','advocate','وکیل','attorney','legal help','legal aid','free lawyer','legal assistance','vakil','bar council','how to find lawyer','need lawyer','cannot afford lawyer','free legal help'],
    answer: `How to Get Legal Help in Pakistan\n\nFinding a Lawyer:\n- District Bar Association: Every district has one\n- High Court Bar Association: For High Court matters\n- Pakistan Bar Council: National verification body\n- Ask trusted people in your community for referrals\n\nFree Legal Aid Services:\n\nPunjab:\n- Punjab Legal Aid Authority: 0800-09008 (completely free)\n- Available to poor and needy citizens\n\nNationwide:\n- AGHS Legal Aid Cell: 042-35761999\n- Rozan Counseling: 051-2602430 (specifically for women)\n- Aurat Foundation: 051-8444000\n- Dastak: 042-35761999 (for women)\n\nCourt-Appointed Free Lawyer:\n- This is your right under Article 10-A of Constitution\n- Tell the court you cannot afford a lawyer\n- Court will appoint one free of charge\n\nTypical Lawyer Fees Approximate:\n- Bail application: Rs 5000 to Rs 50000\n- Family court monthly retainer: Rs 10000 to Rs 100000\n- High Court case: Rs 25000 to Rs 200000 and above\n\nTips for Hiring a Lawyer:\n- Verify registration with Bar Council\n- Get fee agreement in writing before starting\n- Ask about experience in your specific type of case\n- Demand realistic assessment and beware of impossible promises\n- Get second opinion for serious or expensive cases`,
    followUp: ['How to verify if lawyer is genuine?','What is free legal aid in Punjab?','Can I represent myself in court?','How to file complaint against a corrupt lawyer?','What documents to bring to first lawyer meeting?'],
  },
  {
    id: 'annulment',
    keywords: ['annulment','tansikh','تنسیخ نکاح','void marriage','faskh','فسخ','nullity','marriage invalid','nikah invalid','forced marriage','illegal marriage','tansikh nikah'],
    answer: `Annulment of Marriage - Tansikh Nikah - تنسیخ نکاح\n\nWhat is Annulment?\nA court declaration that a marriage was never valid from the beginning. Different from divorce which ends a valid marriage.\n\nGrounds for Annulment in Pakistan:\n- Marriage without genuine consent such as forced or coerced marriage\n- Marriage to a mahram (close relative which is incest)\n- Already-married spouse who hid existing marriage\n- Fraud or serious misrepresentation at time of marriage\n- Minor married without proper guardian\n- Marriage without required witnesses\n- Husband mentally incapacitated at time of Nikah\n\nLegal Process:\n1. File petition in Family Court\n2. State grounds clearly with supporting evidence\n3. Attach Nikah Nama copy\n4. Court may refer to mediation first\n5. If grounds proven, Decree of Annulment is issued\n\nEffect of Annulment:\n- Marriage treated as if it never happened\n- Children born are still considered legitimate\n- Mehr is decided by court based on circumstances\n- Either party can remarry immediately after decree\n\nDifference Between Annulment and Divorce:\n- Annulment means marriage was never valid from start\n- Divorce means a valid marriage that is now ended\n\nGenerate Tansikh Nikah Application on InCrime.`,
    followUp: ['Are children legitimate after annulment?','Can forced marriage be annulled?','How long does annulment take?','What is Mehr after annulment?','Difference between divorce and annulment?'],
  },
  {
    id: 'secondMarriage',
    keywords: ['second marriage','دوسری شادی','second wife','do shadian','permission second marriage','multiple wives','polygamy','existing wife','first wife permission','dusri shadi','second nikah'],
    answer: `Second Marriage Law in Pakistan\n\nGoverning Law: Muslim Family Laws Ordinance 1961 Section 6\n\nLegal Requirements for Second Marriage:\n1. Apply to Arbitration Council at Union Council\n2. First wife must be notified and her consent sought\n3. Provide proof of financial ability to maintain both families\n4. Arbitration Council reviews and grants or denies permission\n5. Only after official permission can second Nikah be performed\n\nIf You Marry Without Permission:\n- This is a criminal offence under Section 6 MFLO\n- Punishment is up to 1 year prison plus Rs 5000 fine\n- First wife can file criminal complaint against husband\n\nIslamic Conditions for Second Marriage:\n- Ability to treat both wives absolutely equally\n- Financial capacity to support both families\n- Strong genuine reason for second marriage\n- First wife rights must be fully protected\n\nFirst Wife Protection Rights:\n- Can include anti-polygamy clause in Nikah Nama (Column 18)\n- If this clause exists and husband marries again, she gets automatic right to Khula\n- Can file for divorce (Khula) if second marriage causes her harm\n\nPractical Advice:\n- Open honest communication with first wife is strongly recommended\n- Consult a family law advocate before proceeding\n\nGenerate Second Marriage Permission Application on InCrime.`,
    followUp: ['Can first wife legally stop second marriage?','What if husband marries without telling first wife?','How to include anti-polygamy in Nikah Nama?','What rights does second wife have?','Is second marriage without permission truly illegal?'],
  },
  {
    id: 'attendance',
    keywords: ['attendance','excused','attendance excused','court attendance','پیشی معاف','حاضری','absent from court','miss court','court date miss','عدم حاضری','peshi','court pe nahi aana','nbw','non bailable warrant','warrant','bailable warrant'],
    answer: `Attendance Excused Application - پیشی معاف\n\nWhat is This?\nWhen you cannot attend court on a scheduled date, file this application asking the judge to excuse your absence.\n\nValid Grounds That Must Have Proof:\n- Medical illness: Hospital or doctor certificate required\n- Travel abroad: Ticket and visa proof required\n- Natural disaster or genuine emergency\n- Unavoidable official duty with written proof\n- Death in immediate family with death certificate\n- Genuine security threat with supporting evidence\n\nImportant Rules:\n- File BEFORE the court date whenever possible\n- Without valid excuse, Bailable Warrant is issued\n- Repeated absences lead to Non-Bailable Warrant (NBW)\n- NBW means police will arrest you\n\nStep by Step Process:\n1. Contact your lawyer immediately when you know you cannot attend\n2. Draft the application with your valid reason\n3. Attach all supporting documents\n4. File through your lawyer before the scheduled date\n5. Court grants or rejects the application\n6. If rejected, you must appear without fail\n\nIf NBW (Non-Bailable Warrant) Already Issued:\n- Surrender before police or appear voluntarily\n- Apply to court for cancellation of NBW\n- Show valid reason for previous absence\n- Request fresh court date\n\nGenerate Attendance Excused Application on InCrime.`,
    followUp: ['What is non-bailable warrant NBW?','How to cancel an arrest warrant?','Can I attend court via video call?','What medical certificate is needed?','What happens if I miss court repeatedly?'],
  },
  {
    id: 'consent',
    keywords: ['consent','رضامندی','agreement','mutual consent','permission','mutual agreement','compromise','صلح','case settle','case band','withdraw case','case wapas lena','compounding','case settlement'],
    answer: `Consent and Compromise Applications in Pakistani Law\n\nWhat is a Consent Application?\nA document recording mutual agreement between parties used to settle cases, give permissions, or record formal agreements.\n\nCommon Uses:\n- Settling a criminal case out of court through compromise\n- Consent for marriage-related matters\n- Permission for certain important family decisions\n- Formally withdrawing a court case\n\nCompounding of Offences Under Section 345 CrPC:\nSome crimes can be officially settled between parties with court approval.\n\nCompoundable Offences That Can Be Settled:\n- Minor hurt and injury cases\n- Defamation cases\n- Minor cheating cases\n- Theft between family members in some circumstances\n\nNon-Compoundable Offences That Cannot Be Settled:\n- Murder\n- Rape and sexual assault\n- Dacoity\n- Kidnapping\n- Terrorism cases\n\nCompromise Process:\n1. Both parties agree to all terms of settlement\n2. Written consent application is drafted by lawyer\n3. Filed before the court handling the case\n4. Judge carefully verifies genuine consent without pressure\n5. Court accepts and case is closed, or court rejects and case continues\n\nNote: For serious offences, even with consent from victim, the state can continue prosecution.\n\nGenerate Consent Application on InCrime.`,
    followUp: ['What crimes can be settled by compromise?','How to withdraw an FIR after compromise?','What is Diyat in Pakistani law?','How to write a compromise deed?','Can police case be withdrawn by consent?'],
  },
  {
    id: 'templates',
    keywords: ['template','generate','document','application form','درخواست','how to generate','create document','make application','legal form','legal document','kaise banaye','form kahan','what templates','available templates'],
    answer: `InCrime Legal Templates - All 14 Available\n\nCriminal Case Templates:\n1. Pre-Arrest Bail Application: Anticipatory bail before arrest\n2. Post-Arrest Bail Application: Release after arrest application\n3. Theft or FIR Application: Report theft or robbery\n4. Harassment Application: Against any type of harassment\n5. Challan Application: Court action on police challan\n6. Consent Application: Case settlement or withdrawal\n7. Attendance Excused: Court absence excuse application\n\nFamily Case Templates:\n8. Nikah Nama Form: Marriage registration\n9. Child Custody Application: Guardianship petition\n10. Annulment Tansikh Nikah: Void marriage petition\n11. Second Marriage Permission: Court permission application\n12. Release from Dar-ul-Aman: Release application\n13. Meeting at Dar-ul-Aman: Visit permission application\n14. Sending to Dar-ul-Aman: Protection application\n\nHow to Generate in 4 Simple Steps:\n1. Click Create Application in the top navigation bar\n2. Select Case Type: Criminal or Family\n3. Select your specific Case Category\n4. Fill in the Urdu form fields and see live preview\n5. Click Print or Download to save your PDF\n\nAll documents are in Urdu Nastaliq format ready for Pakistani courts.\nYour applications are automatically saved in My Applications section.`,
    followUp: ['How to fill bail application form?','How to print and download the document?','What information is needed for Nikah Nama?','How do I see my saved applications?','Can I edit the document after generating?'],
  },
  {
    id: 'general',
    keywords: ['what','law','قانون','legal','how','procedure','rights','explain','tell me','بتائیں','کیا ہے','کیسے','need help','assistance','guide','information','pakistan law','legal advice','legal question'],
    answer: `InCrime Legal AI - Topics I Can Help With\n\nCriminal Law:\n- Bail (Pre and Post arrest)\n- FIR filing and procedure\n- Theft, Robbery, and Dacoity\n- Harassment and Cybercrime\n- Challan and Court Procedures\n\nFamily Law:\n- Nikah and Marriage Registration\n- Divorce including Talaq and Khula\n- Child Custody and Guardianship\n- Maintenance (Nafaqa)\n- Dar-ul-Aman Applications\n- Second Marriage Law\n- Annulment (Tansikh Nikah)\n\nRights and Procedures:\n- Fundamental Rights under Constitution\n- Court System Explained Simply\n- Police Complaints and Actions\n- Free Legal Aid Information\n- Property Law and Inheritance\n- Domestic Violence Protection\n\nDocument Generation:\n- 14 ready-to-use Urdu legal templates for Pakistani courts\n\nPlease type your specific question and I will give you a detailed answer with relevant laws, step by step process, required documents, and emergency contacts.\n\nYou can ask in English or Urdu.`,
    followUp: ['How to file a bail application?','How to file an FIR?','How to get divorce or Khula?','What are my rights if arrested?','How to report cyber crime?'],
  },
];

// ─── SMART MATCHING ENGINE ─────────────────────────────────────────────────
function findBestMatch(userMessage) {
  const msg = userMessage.toLowerCase().trim();
  let bestScore = 0;
  let bestMatch = KB[KB.length - 1]; // default to general

  for (const entry of KB) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (msg.includes(kw.toLowerCase())) {
        score += kw.length > 8 ? 4 : kw.length > 5 ? 3 : kw.length > 3 ? 2 : 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  // Fuzzy partial match if no direct match
  if (bestScore === 0) {
    const words = msg.split(/\s+/).filter(w => w.length > 3);
    for (const entry of KB) {
      for (const kw of entry.keywords) {
        for (const word of words) {
          if (kw.includes(word) || word.includes(kw.slice(0, 4))) {
            return entry;
          }
        }
      }
    }
  }

  return bestMatch;
}

// ─── ROUTES ────────────────────────────────────────────────────────────────
router.post('/message', protect, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }
    const matched = findBestMatch(message.trim());
    res.json({
      success: true,
      response: matched.answer,
      suggestions: matched.followUp || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ success: false, message: 'Chatbot error. Please try again.' });
  }
});

router.get('/topics', protect, (req, res) => {
  res.json({
    success: true,
    topics: [
      { label: 'Bail Application', question: 'How to file a bail application in Pakistan?' },
      { label: 'File FIR', question: 'How to file an FIR at police station?' },
      { label: 'Divorce / Khula', question: 'How to get divorce or Khula in Pakistan?' },
      { label: 'Child Custody', question: 'How does child custody work in Pakistan?' },
      { label: 'Harassment', question: 'What are my legal options against harassment?' },
      { label: 'Legal Rights', question: 'What are my fundamental rights in Pakistan?' },
      { label: 'Cyber Crime', question: 'How to report cyber crime in Pakistan?' },
      { label: 'Maintenance', question: 'How to claim maintenance Nafaqa from husband?' },
      { label: 'Nikah / Marriage', question: 'What documents are needed for Nikah registration?' },
      { label: 'Dar-ul-Aman', question: 'What is Dar-ul-Aman and how to apply?' },
      { label: 'Property Law', question: 'How to resolve property dispute in Pakistan?' },
      { label: 'Domestic Violence', question: 'How to get protection from domestic violence?' },
    ],
  });
});

module.exports = router;
