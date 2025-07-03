import React, { useState, useContext, createContext, useMemo, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import DatePicker from 'react-datepicker';
import { Upload, User, MapPin, Trophy, Heart, Shield, Mail, Phone, UserPlus, Globe, Calendar, Award, AlertCircle, FileText, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import logo1 from '../assets/logo1.png';
import logo2 from '../assets/logo2.png';

// Import new accessible components
import ScreenReader from '../components/ScreenReader';
import AccessibleInput from '../components/AccessibleInput';
import AccessibleSelect from '../components/AccessibleSelect';
import AccessibleTextarea from '../components/AccessibleTextarea';
import KeyboardNavigation from '../components/KeyboardNavigation';
import ParaSportsIcons from '../components/ParaSportsIcons';
import { ScreenReaderContext } from '../components/ScreenReader';

// Create form language context
export const FormLanguageContext = createContext();

// Debounce hook for performance
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const apiBase = import.meta.env.VITE_API_URL || '';
const url = apiBase ? `${apiBase}/api/players` : '/api/players';

const PlayerRegistration = React.memo(() => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formLanguage, setFormLanguage] = useState('en'); // Form text language
  
  // Get audio context from ScreenReader
  const { speak, speakField, isAudioEnabled } = useContext(ScreenReaderContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control
  } = useForm();

  // Memoize options to prevent re-renders
  const sportsOptions = useMemo(() => [
    { value: 'Wheelchair Basketball', label: 'Wheelchair Basketball' },
    { value: 'Wheelchair Tennis', label: 'Wheelchair Tennis' },
    { value: 'Wheelchair Rugby', label: 'Wheelchair Rugby' },
    { value: 'Para Athletics', label: 'Para Athletics' },
    { value: 'Para Swimming', label: 'Para Swimming' },
    { value: 'Para Powerlifting', label: 'Para Powerlifting' },
    { value: 'Para Table Tennis', label: 'Para Table Tennis' },
    { value: 'Para Badminton', label: 'Para Badminton' },
    { value: 'Para Tennis', label: 'Para Tennis' },
    { value: 'Para Volleyball', label: 'Para Volleyball' },
    { value: 'Para Archery', label: 'Para Archery' },
    { value: 'Para Cycling', label: 'Para Cycling' },
    { value: 'Para Judo', label: 'Para Judo' },
    { value: 'Para Taekwondo', label: 'Para Taekwondo' },
    { value: 'Para Triathlon', label: 'Para Triathlon' },
    { value: 'Para Sailing', label: 'Para Sailing' },
    { value: 'Para Canoe', label: 'Para Canoe' },
    { value: 'Para Rowing', label: 'Para Rowing' },
    { value: 'Para Equestrian', label: 'Para Equestrian' },
    { value: 'Para Shooting', label: 'Para Shooting' },
    { value: 'Para Boccia', label: 'Para Boccia' },
    { value: 'Para Goalball', label: 'Para Goalball' },
    { value: 'Para Football', label: 'Para Football' },
    { value: 'Para Cricket', label: 'Para Cricket' },
    { value: 'Para Hockey', label: 'Para Hockey' },
    { value: 'Para Golf', label: 'Para Golf' },
    { value: 'Para Alpine Skiing', label: 'Para Alpine Skiing' },
    { value: 'Para Cross-Country Skiing', label: 'Para Cross-Country Skiing' },
    { value: 'Para Snowboarding', label: 'Para Snowboarding' },
    { value: 'Para Ice Hockey', label: 'Para Ice Hockey' },
    { value: 'Para Curling', label: 'Para Curling' },
    { value: 'Para Bobsleigh', label: 'Para Bobsleigh' },
    { value: 'Para Skeleton', label: 'Para Skeleton' },
    { value: 'Para Luge', label: 'Para Luge' },
    { value: 'Para Biathlon', label: 'Para Biathlon' },
    { value: 'Other', label: 'Other' }
  ], []);

  const disabilityOptions = useMemo(() => [
    { value: 'Physical Impairment', label: 'Physical Impairment' },
    { value: 'Visual Impairment', label: 'Visual Impairment' },
    { value: 'Intellectual Impairment', label: 'Intellectual Impairment' },
    { value: 'Hearing Impairment', label: 'Hearing Impairment' },
    { value: 'Multiple Disabilities', label: 'Multiple Disabilities' },
    { value: 'Other', label: 'Other' }
  ], []);

  const experienceOptions = useMemo(() => [
    { value: 'Beginner', label: 'Beginner (0-1 years)' },
    { value: 'Intermediate', label: 'Intermediate (2-5 years)' },
    { value: 'Advanced', label: 'Advanced (6-10 years)' },
    { value: 'Elite', label: 'Elite (10+ years)' }
  ], []);

  const genderOptions = useMemo(() => [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ], []);

  // Add disability classification options with useMemo
  const disabilityClassificationOptions = useMemo(() => [
    { value: 'T/F11-T/F13', label: 'T/F11-T/F13 (Visual Impairment)' },
    { value: 'T/F20', label: 'T/F20 (Intellectual Impairment)' },
    { value: 'T/F31-T/F38', label: 'T/F31-T/F38 (Coordination Impairments)' },
    { value: 'T/F40-T/F41', label: 'T/F40-T/F41 (Short Stature)' },
    { value: 'T/F42-T/F47', label: 'T/F42-T/F47 (Limb Deficiency, Leg Length Difference, Impaired Muscle Power or Impaired Range of Movement)' },
    { value: 'T/F51-T/F57', label: 'T/F51-T/F57 (Wheelchair Track & Field)' },
    { value: 'S1-S10', label: 'S1-S10 (Physical Impairment - Swimming)' },
    { value: 'S11-S13', label: 'S11-S13 (Visual Impairment - Swimming)' },
    { value: 'S14', label: 'S14 (Intellectual Impairment - Swimming)' },
    { value: 'SB1-SB9', label: 'SB1-SB9 (Breaststroke - Swimming)' },
    { value: 'SM1-SM10', label: 'SM1-SM10 (Medley - Swimming)' },
    { value: 'LW1-LW12', label: 'LW1-LW12 (Winter Sports)' },
    { value: 'B1-B3', label: 'B1-B3 (Blind/Visually Impaired)' },
    { value: 'SH1, SH2', label: 'SH1, SH2 (Shooting)' },
    { value: 'C1-C5', label: 'C1-C5 (Cycling)' },
    { value: 'H1-H5', label: 'H1-H5 (Handcycling)' },
    { value: 'T1-T2', label: 'T1-T2 (Tricycle)' },
    { value: 'PT1-PT5', label: 'PT1-PT5 (Paratriathlon)' },
    { value: 'Other', label: 'Other (please specify)' }
  ], []);

  // Memoize form translations to prevent re-creation
  const formTranslations = useMemo(() => ({
    en: {
      'Player Registration Form': 'Player Registration Form',
      'Complete the form below to register as a para sports player': 'Complete the form below to register as a para sports player',
      'Personal Information': 'Personal Information',
      'Address Information': 'Address Information',
      'Sports Information': 'Sports Information',
      'Disability Information': 'Disability Information',
      'Medical Information': 'Medical Information',
      'Profile Photo': 'Profile Photo',
      'First Name': 'First Name',
      'Last Name': 'Last Name',
      'Date of Birth': 'Date of Birth',
      'Gender': 'Gender',
      'Email Address': 'Email Address',
      'Phone Number': 'Phone Number',
      'Street Address': 'Street Address',
      'City': 'City',
      'State': 'State',
      'Postal Code': 'Postal Code',
      'Country': 'Country',
      'Primary Sport': 'Primary Sport',
      'Secondary SpInformationort': 'Secondary Sport',
      'Experience Level': 'Experience Level',
      'Years of Experience': 'Years of Experience',
      'Coach Name': 'Coach Name',
      'Coach Contact': 'Coach Contact',
      'Achievements': 'Achievements',
      'Disability Type': 'Disability Type',
      'Disability Classification': 'Disability Classification',
      'Impairment Description': 'Impairment Description',
      'Emergency Contact Name': 'Emergency Contact Name',
      'Relationship': 'Relationship',
      'Emergency Contact Phone': 'Emergency Contact Phone',
      'Medical Conditions': 'Medical Conditions',
      'Medications': 'Medications',
      'Allergies': 'Allergies',
      'Select date of birth': 'Select date of birth',
      'Select gender': 'Select gender',
      'Select primary sport': 'Select primary sport',
      'Select secondary sport (optional)': 'Select secondary sport (optional)',
      'Select experience level': 'Select experience level',
      'Select disability type': 'Select disability type',
      'e.g., T44, S10, etc.': 'e.g., T44, S10, etc.',
      'Please describe your impairment in detail': 'Please describe your impairment in detail',
      'e.g., Parent, Spouse, Guardian': 'e.g., Parent, Spouse, Guardian',
      'List any relevant medical conditions': 'List any relevant medical conditions',
      'List any medications you are currently taking': 'List any medications you are currently taking',
      'List your sports achievements, medals, records, etc.': 'List your sports achievements, medals, records, etc.',
      'Click or drag to upload profile photo': 'Click or drag to upload profile photo',
      'Drop the photo here': 'Drop the photo here',
      'Click or drag to replace photo': 'Click or drag to replace photo',
      'JPG, PNG, GIF up to 5MB': 'JPG, PNG, GIF up to 5MB',
      'Register Player & Generate ID Card': 'Register Player & Generate ID Card',
      'Registering Player...': 'Registering Player...',
      'Change Form Language': 'Change Form Language',
      'English': 'English',
      'Hindi': 'Hindi',
      'Gujarati': 'Gujarati'
    },
    hi: {
      'Player Registration Form': 'खिलाड़ी पंजीकरण फॉर्म',
      'Complete the form below to register as a para sports player': 'पैरा स्पोर्ट्स खिलाड़ी के रूप में पंजीकरण करने के लिए नीचे दिया गया फॉर्म भरें',
      'Personal Information': 'व्यक्तिगत जानकारी',
      'Address Information': 'पता जानकारी',
      'Sports Information': 'खेल जानकारी',
      'Disability Information': 'अक्षमता जानकारी',
      'Medical Information': 'चिकित्सीय जानकारी',
      'Profile Photo': 'प्रोफाइल फोटो',
      'First Name': 'पहला नाम',
      'Last Name': 'अंतिम नाम',
      'Date of Birth': 'जन्म तिथि',
      'Gender': 'लिंग',
      'Email Address': 'ईमेल पता',
      'Phone Number': 'फोन नंबर',
      'Street Address': 'सड़क का पता',
      'City': 'शहर',
      'State': 'राज्य',
      'Postal Code': 'पिन कोड',
      'Country': 'देश',
      'Primary Sport': 'मुख्य खेल',
      'Secondary Sport': 'द्वितीयक खेल',
      'Experience Level': 'अनुभव स्तर',
      'Years of Experience': 'अनुभव के वर्ष',
      'Coach Name': 'कोच का नाम',
      'Coach Contact': 'कोच का संपर्क',
      'Achievements': 'उपलब्धियां',
      'Disability Type': 'अक्षमता का प्रकार',
      'Disability Classification': 'अक्षमता वर्गीकरण',
      'Impairment Description': 'अक्षमता का विवरण',
      'Emergency Contact Name': 'आपातकालीन संपर्क का नाम',
      'Relationship': 'संबंध',
      'Emergency Contact Phone': 'आपातकालीन संपर्क फोन',
      'Medical Conditions': 'चिकित्सीय स्थितियां',
      'Medications': 'दवाएं',
      'Allergies': 'एलर्जी',
      'Select date of birth': 'जन्म तिथि चुनें',
      'Select gender': 'लिंग चुनें',
      'Select primary sport': 'मुख्य खेल चुनें',
      'Select secondary sport (optional)': 'द्वितीयक खेल चुनें (वैकल्पिक)',
      'Select experience level': 'अनुभव स्तर चुनें',
      'Select disability type': 'अक्षमता का प्रकार चुनें',
      'e.g., T44, S10, etc.': 'जैसे, टी44, एस10, आदि',
      'Please describe your impairment in detail': 'कृपया अपनी अक्षमता का विस्तार से वर्णन करें',
      'e.g., Parent, Spouse, Guardian': 'जैसे, माता-पिता, पति/पत्नी, अभिभावक',
      'List any relevant medical conditions': 'कोई भी प्रासंगिक चिकित्सीय स्थितियां सूचीबद्ध करें',
      'List any medications you are currently taking': 'वर्तमान में ली जा रही कोई भी दवाएं सूचीबद्ध करें',
      'List your sports achievements, medals, records, etc.': 'अपनी खेल उपलब्धियां, पदक, रिकॉर्ड आदि सूचीबद्ध करें',
      'Click or drag to upload profile photo': 'प्रोफाइल फोटो अपलोड करने के लिए क्लिक करें या खींचें',
      'Drop the photo here': 'फोटो यहां छोड़ें',
      'Click or drag to replace photo': 'फोटो बदलने के लिए क्लिक करें या खींचें',
      'JPG, PNG, GIF up to 5MB': 'जेपीजી, पीएनजી, जीआइएफ 5 एमबी तक',
      'Register Player & Generate ID Card': 'खिलाड़ी पंजीकरण करें और आईडी कार्ड बनाएं',
      'Registering Player...': 'खिलाड़ी पंजीकरण हो रहा है...',
      'Change Form Language': 'फॉर्म भाषा बदलें',
      'English': 'अंग्रेजी',
      'Hindi': 'हिंदी',
      'Gujarati': 'गुजराती',
      // Additional field labels for better pronunciation
      'Name': 'नाम',
      'Address': 'पता',
      'Sport': 'खेल',
      'Experience': 'अनुभव',
      'Contact': 'संपर्क',
      'Emergency': 'आपातकालीन',
      'Medical': 'चिकित्सीय',
      'Photo': 'फोटो',
      'Upload': 'अपलोड',
      'Submit': 'जमा करें',
      'Cancel': 'रद्द करें',
      'Save': 'सहेजें',
      'Edit': 'संपादित करें',
      'Delete': 'हटाएं',
      'Required': 'आवश्यक',
      'Optional': 'वैकल्पिक',
      'Error': 'त्रुटि',
      'Success': 'सफलता',
      'Warning': 'चेतावनी',
      'Info': 'जानकारी'
    },
    gu: {
      'Player Registration Form': 'ખેલાડી નોંધણી ફોર્મ',
      'Complete the form below to register as a para sports player': 'પેરા સ્પોર્ટ્સ ખેલાડી તરીકે નોંધણી કરવા માટે નીચેનું ફોર્મ ભરો',
      'Personal Information': 'વ્યક્તિગત માહિતી',
      'Address Information': 'સરનામું માહિતી',
      'Sports Information': 'ક્રીડા માહિતી',
      'Disability Information': 'અપંગતા માહિતી',
      'Medical Information': 'દવાકીય માહિતી',
      'Profile Photo': 'પ્રોફાઇલ ફોટો',
      'First Name': 'પહેલું નામ',
      'Last Name': 'છેલ્લું નામ',
      'Date of Birth': 'જન્મ તારીખ',
      'Gender': 'લિંગ',
      'Email Address': 'ઈમેઇલ સરનામું',
      'Phone Number': 'ફોન નંબર',
      'Street Address': 'શેરીનું સરનામું',
      'City': 'શહેર',
      'State': 'રાજ્ય',
      'Postal Code': 'પીન કોડ',
      'Country': 'દેશ',
      'Primary Sport': 'મુખ્ય ક્રીડા',
      'Secondary Sport': 'દ્વિતીય ક્રીડા',
      'Experience Level': 'અનુભવ સ્તર',
      'Years of Experience': 'અનુભવના વર્ષો',
      'Coach Name': 'કોચનું નામ',
      'Coach Contact': 'કોચનો સંપર્ક',
      'Achievements': 'પ્રાપ્તિઓ',
      'Disability Type': 'અપંગતાનો પ્રકાર',
      'Disability Classification': 'અપંગતા વર્ગીકરણ',
      'Impairment Description': 'અપંગતાનું વર્ણન',
      'Emergency Contact Name': 'કટોકટી સંપર્કનું નામ',
      'Relationship': 'સંબંધ',
      'Emergency Contact Phone': 'કટોકટી સંપર્ક ફોન',
      'Medical Conditions': 'દવાકીય સ્થિતિઓ',
      'Medications': 'દવાઓ',
      'Allergies': 'એલર્જી',
      'Select date of birth': 'જન્મ તારીખ પસંદ કરો',
      'Select gender': 'લિંગ પસંદ કરો',
      'Select primary sport': 'મુખ્ય ક્રીડા પસંદ કરો',
      'Select secondary sport (optional)': 'દ્વિતીય ક્રીડા પસંદ કરો (વૈકલ્પિક)',
      'Select experience level': 'અનુભવ સ્તર પસંદ કરો',
      'Select disability type': 'અપંગતાનો પ્રકાર પસંદ કરો',
      'e.g., T44, S10, etc.': 'દા.ત., ટી44, એસ10, વગેરે',
      'Please describe your impairment in detail': 'કૃપા કરી તમારી અપંગતાનું વિગતવાર વર્ણન કરો',
      'e.g., Parent, Spouse, Guardian': 'દા.ત., માતા-પિતા, પતિ/પત્ની, સંરક્ષક',
      'List any relevant medical conditions': 'કોઈપણ સંબંધિત દવાકીય સ્થિતિઓની યાદી બનાવો',
      'List any medications you are currently taking': 'તમે હાલમાં લઈ રહ્યા છો તે કોઈપણ દવાઓની યાદી બનાવો',
      'List your sports achievements, medals, records, etc.': 'તમારી ક્રીડા પ્રાપ્તિઓ, મેડલ્સ, રેકોર્ડ્સ, વગેરેની યાદી બનાવો',
      'Click or drag to upload profile photo': 'પ્રોફાઇલ ફોટો અપલોડ કરવા માટે ક્લિક કરો અથવા ખેંચો',
      'Drop the photo here': 'ફોટો અહીં છોડો',
      'Click or drag to replace photo': 'ફોટો બદલવા માટે ક્લિક કરો અથવા ખેંચો',
      'JPG, PNG, GIF up to 5MB': 'જેપીજી, પીએનજી, જીઆઇએફ 5 એમબી સુધી',
      'Register Player & Generate ID Card': 'ખેલાડી નોંધણી કરો અને આઇડી કાર્ડ બનાવો',
      'Registering Player...': 'ખેલાડી નોંધણી થઈ રહી છે...',
      'Change Form Language': 'ફોર્મ ભાષા બદલો',
      'English': 'અંગ્રેજી',
      'Hindi': 'હિન્દી',
      'Gujarati': 'ગુજરાતી',
      // Additional field labels for better pronunciation
      'Name': 'નામ',
      'Address': 'સરનામું',
      'Sport': 'ક્રીડા',
      'Experience': 'અનુભવ',
      'Contact': 'સંપર્ક',
      'Emergency': 'કટોકટી',
      'Medical': 'દવાકીય',
      'Photo': 'ફોટો',
      'Upload': 'અપલોડ',
      'Submit': 'સબમિટ',
      'Cancel': 'રદ કરો',
      'Save': 'સાચવો',
      'Edit': 'સંપાદિત કરો',
      'Delete': 'કાઢી નાખો',
      'Required': 'જરૂરી',
      'Optional': 'વૈકલ્પિક',
      'Error': 'ભૂલ',
      'Success': 'સફળતા',
      'Warning': 'ચેતવણી',
      'Info': 'માહિતી'
    }
  }), [formLanguage]);

  // Translation function
  const translateFormText = useCallback((key) => {
    return formTranslations[formLanguage]?.[key] || key;
  }, [formTranslations, formLanguage]);

  // Handle form language change
  const handleFormLanguageChange = useCallback((language) => {
    setFormLanguage(language);
    speak(`Form language changed to ${language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Gujarati'}`);
  }, [speak]);

  // File upload handling
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      speak('Profile photo uploaded successfully');
    }
  }, [speak]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  // Form submission
  const onSubmit = useCallback(async (data) => {
    setIsSubmitting(true);
    
    try {
      
      const formData = new FormData();
      
      // Format the data according to server schema
      const formattedData = {
        // Personal Information
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : null,
        gender: data.gender,
        email: data.email,
        phone: data.phone,
        passportNumber: data.passportNumber,
        
        // Address Information - fix field names
        address: {
          street: data.address?.streetAddress,
          city: data.address?.city,
          state: data.address?.state,
          postalCode: data.address?.postalCode,
          country: data.address?.country
        },
        
        // Sports Information
        primarySport: data.primarySport,
        secondarySport: data.secondarySport,
        experienceLevel: data.experienceLevel,
        yearsOfExperience: parseInt(data.yearsOfExperience) || 0,
        coachName: data.coachName,
        coachContact: data.coachContact,
        achievements: data.achievements,
        
        // Disability Information
        disabilityType: data.disabilityType,
        disabilityClassification: data.disabilityClassification,
        impairmentDescription: data.impairmentDescription,
        
        // Medical Information
        emergencyContact: {
          name: data.emergencyContact?.name,
          relationship: data.emergencyContact?.relationship,
          phone: data.emergencyContact?.phone
        },
        medicalConditions: data.medicalConditions,
        medications: data.medications,
        allergies: data.allergies
      };
      
      // Add all formatted data to FormData
      Object.keys(formattedData).forEach(key => {
        if (typeof formattedData[key] === 'object' && formattedData[key] !== null) {
          // Handle nested objects by flattening them
          if (key === 'address') {
            Object.keys(formattedData[key]).forEach(subKey => {
              formData.append(`address.${subKey}`, formattedData[key][subKey]);
            });
          } else if (key === 'emergencyContact') {
            Object.keys(formattedData[key]).forEach(subKey => {
              formData.append(`emergencyContact.${subKey}`, formattedData[key][subKey]);
            });
          } else {
            formData.append(key, JSON.stringify(formattedData[key]));
          }
        } else if (formattedData[key] !== undefined && formattedData[key] !== null) {
          formData.append(key, formattedData[key]);
        }
      });
      
      // Add profile photo if selected
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }
      

      
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });
      
      toast.success('Player registered successfully! ID card has been sent to your email.');
      reset();
      setProfilePhoto(null);
      setPhotoPreview(null);
      
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [profilePhoto, reset]);

  return (
    <div className="min-h-screen relative">
      {/* Para Sports Decorative Background */}
      <ParaSportsIcons />

      <div className="container-responsive page-padding relative z-10">
        <KeyboardNavigation>
          <FormLanguageContext.Provider value={{ formLanguage, setFormLanguage }}>
            <div className="card p-8">
              {/* Header with language switcher */}
              <div className="relative text-center mb-8">
                {/* Para Sports Decorative Images - Positioned around the header */}
                {/* <img 
                  src="https://png.pngtree.com/png-clipart/20230303/original/pngtree-paralympic-sports-basketball-png-image_8970272.png" 
                  alt="Para Sports Basketball" 
                  className="absolute top-6 right-6 w-20 h-20 object-contain opacity-60"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <img 
                  src="https://i.pinimg.com/564x/52/3c/bc/523cbc7e981f0d110f6a9bbe67f67cee.jpg" 
                  alt="Para Sports Athletics" 
                  className="absolute top-3 left-10 w-20 h-20 object-contain opacity-60"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <img 
                  src="https://png.pngtree.com/png-clipart/20230227/original/pngtree-olympic-and-paralympic-events-archery-png-image_8965957.png" 
                  alt="Para Sports Archery" 
                  className="absolute bottom-3 right-10 w-20 h-20 object-contain opacity-60"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <img 
                  src="https://images.vexels.com/media/users/3/211511/isolated/preview/a106f962f7a0198459bad9cec315bde4-paralympic-sport-pictogram-running-flat.png" 
                  alt="Para Sports Running" 
                  className="absolute bottom-4 left-4 w-20 h-20 object-contain opacity-60"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }} */}
                {/* /> */}
                
                <div className="flex items-center justify-center gap-2 mb-8 px-2">
                  <img src={logo1} alt="Logo 1" className="h-10 w-auto sm:h-14 md:h-[100px] flex-shrink-0" />
                  <h1 className="text-lg sm:text-2xl md:text-4xl font-bold text-center text-gray-800 flex-1 px-2 break-words whitespace-normal leading-tight max-w-xs sm:max-w-md md:max-w-full">
                    Para Sports Players Registration
                  </h1>
                  <img src={logo2} alt="Logo 2" className="h-10 w-auto sm:h-14 md:h-[100px] flex-shrink-0" />
                </div>
                
                {/* Language Switcher */}
                <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 w-fit mx-auto">
                  <Globe size={20} className="text-blue-600" />
                  <select
                    value={formLanguage}
                    onChange={(e) => handleFormLanguageChange(e.target.value)}
                    className="bg-transparent border-none outline-none text-gray-700 font-medium cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 py-1 transition-all duration-200 hover:bg-gray-100"
                    aria-label="Select form language"
                  >
                    <option value="en">{translateFormText('English')}</option>
                    <option value="hi">{translateFormText('Hindi')}</option>
                    <option value="gu">{translateFormText('Gujarati')}</option>
                  </select>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="content-spacing">
                {/* Personal Information Section */}
                <div className="form-section bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 relative">
                  {/* Section Background Decorative Element */}
                  <div className="absolute top-4 right-4 w-16 h-16 opacity-10 flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                  </div>
                  
                  {/* Para Sports Decorative Image */}
                  {/* <img 
                    src="https://png.pngtree.com/png-clipart/20230303/original/pngtree-paralympic-sports-basketball-png-image_8970272.png" 
                    alt="Para Sports Basketball" 
                    className="absolute top-8 left-8 w-16 h-16 object-contain opacity-20"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  /> */}
                  
                  <h2 className="form-section-title text-blue-900">
                    <div className="form-section-icon bg-gradient-to-br from-blue-500 to-blue-600">
                      <User size={24} className="text-white" />
                    </div>
                    {translateFormText('Personal Information')}
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <AccessibleInput
                      label={translateFormText('First Name')}
                      id="firstName"
                      {...register('firstName', { required: true })}
                      error={errors.firstName}
                      autoComplete="given-name"
                      onFocus={() => speakField('First Name')}
                      className="w-full"
                    />
                    <AccessibleInput
                      label={translateFormText('Last Name')}
                      id="lastName"
                      {...register('lastName', { required: true })}
                      error={errors.lastName}
                      autoComplete="family-name"
                      onFocus={() => speakField('Last Name')}
                      className="w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <AccessibleInput
                      label={translateFormText('Email Address')}
                      id="email"
                      {...register('email', { required: true })}
                      error={errors.email}
                      autoComplete="email"
                      onFocus={() => speakField('Email Address')}
                      className="w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <AccessibleInput
                      label={translateFormText('Phone Number')}
                      id="phone"
                      {...register('phone', { required: true })}
                      error={errors.phone}
                      autoComplete="tel"
                      onFocus={() => speakField('Phone Number')}
                      className="w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <AccessibleInput
                      label="Passport Number"
                      id="passportNumber"
                      {...register('passportNumber')}
                      error={errors.passportNumber}
                      autoComplete="off"
                      onFocus={() => speakField('Passport Number')}
                      className="w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={field.onChange}
                          dateFormat="yyyy-MM-dd"
                          placeholderText={translateFormText('Select date of birth')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          maxDate={new Date()}
                          showYearDropdown
                          showMonthDropdown
                          dropdownMode="select"
                        />
                      )}
                    />
                  </div>
                  <div className="mb-4">
                    <Controller
                      name="gender"
                      control={control}
                      rules={{ required: 'Gender is required' }}
                      render={({ field }) => (
                        <AccessibleSelect
                          label={translateFormText('Gender')}
                          options={genderOptions}
                          value={field.value}
                          onChange={option => field.onChange(option.value)}
                          isClearable
                          placeholder={translateFormText('Select gender')}
                          error={errors.gender}
                          onFocus={() => speakField('Gender')}
                          className="w-full"
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Address Information Section */}
                <div className="form-section bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 relative">
                  {/* Section Background Decorative Element */}
                  <div className="absolute top-4 right-4 w-16 h-16 opacity-5 flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                  </div>
                  
                  <h2 className="form-section-title text-blue-900">
                    <div className="form-section-icon bg-gradient-to-br from-blue-500 to-blue-600">
                      <MapPin size={24} className="text-white" />
                    </div>
                    {translateFormText('Address Information')}
                  </h2>
                  
                  <div className="space-y-4">
                    <AccessibleInput
                      label={translateFormText('Street Address')}
                      fieldKey="address"
                      {...register('address.streetAddress', { required: 'Street address is required' })}
                      error={errors.address?.streetAddress?.message}
                      speak={speak}
                      speakField={speakField}
                      isAudioEnabled={isAudioEnabled}
                      required
                      className="input-field"
                    />
                    
                    <div className="form-grid">
                      <AccessibleInput
                        label={translateFormText('City')}
                        fieldKey="city"
                        {...register('address.city', { required: 'City is required' })}
                        error={errors.address?.city?.message}
                        speak={speak}
                        speakField={speakField}
                        isAudioEnabled={isAudioEnabled}
                        required
                        className="input-field"
                      />
                      
                      <AccessibleInput
                        label={translateFormText('State')}
                        fieldKey="state"
                        {...register('address.state', { required: 'State is required' })}
                        error={errors.address?.state?.message}
                        speak={speak}
                        speakField={speakField}
                        isAudioEnabled={isAudioEnabled}
                        required
                        className="input-field"
                      />
                    </div>
                    
                    <div className="form-grid">
                      <AccessibleInput
                        label={translateFormText('Postal Code')}
                        fieldKey="postalCode"
                        {...register('address.postalCode', { required: 'Postal code is required' })}
                        error={errors.address?.postalCode?.message}
                        speak={speak}
                        speakField={speakField}
                        isAudioEnabled={isAudioEnabled}
                        required
                        className="input-field"
                      />
                      
                      <AccessibleInput
                        label={translateFormText('Country')}
                        fieldKey="country"
                        {...register('address.country', { required: 'Country is required' })}
                        error={errors.address?.country?.message}
                        speak={speak}
                        speakField={speakField}
                        isAudioEnabled={isAudioEnabled}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Sports Information Section */}
                <div className="form-section bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 relative">
                  {/* Section Background Decorative Element */}
                  <div className="absolute top-4 right-4 w-16 h-16 opacity-10 flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                  </div>
                  
                  {/* Para Sports Decorative Image */}
                  {/* <img 
                    src="https://images.vexels.com/media/users/3/211511/isolated/preview/a106f962f7a0198459bad9cec315bde4-paralympic-sport-pictogram-running-flat.png" 
                    alt="Para Sports Running" 
                    className="absolute top-8 left-8 w-16 h-16 object-contain opacity-20"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  /> */}
                  
                  <h2 className="form-section-title text-blue-900">
                    <div className="form-section-icon bg-gradient-to-br from-blue-500 to-blue-600">
                      <Trophy size={24} className="text-white" />
                    </div>
                    {translateFormText('Sports Information')}
                  </h2>
                  
                  <div className="form-grid">
                    <Controller
                      name="primarySport"
                      control={control}
                      rules={{ required: 'Primary sport is required' }}
                      render={({ field }) => (
                        <AccessibleSelect
                          label={translateFormText('Primary Sport')}
                          options={sportsOptions}
                          value={field.value}
                          onChange={(option) => field.onChange(option?.value || '')}
                          error={errors.primarySport?.message}
                          speak={speak}
                          speakField={speakField}
                          isAudioEnabled={isAudioEnabled}
                          required
                          className="select-field"
                          placeholder={translateFormText('Select primary sport')}
                        />
                      )}
                    />
                    
                    <Controller
                      name="secondarySport"
                      control={control}
                      render={({ field }) => (
                        <AccessibleSelect
                          label={translateFormText('Secondary Sport')}
                          options={sportsOptions}
                          value={field.value}
                          onChange={(option) => field.onChange(option?.value || '')}
                          error={errors.secondarySport?.message}
                          speak={speak}
                          speakField={speakField}
                          isAudioEnabled={isAudioEnabled}
                          className="select-field"
                          placeholder={translateFormText('Select secondary sport (optional)')}
                        />
                      )}
                    />
                  </div>
                  
                  <div className="form-grid-full">
                    <Controller
                      name="experienceLevel"
                      control={control}
                      rules={{ required: 'Experience level is required' }}
                      render={({ field }) => (
                        <AccessibleSelect
                          label={translateFormText('Experience Level')}
                          options={experienceOptions}
                          value={field.value}
                          onChange={(option) => field.onChange(option?.value || '')}
                          error={errors.experienceLevel?.message}
                          speak={speak}
                          speakField={speakField}
                          isAudioEnabled={isAudioEnabled}
                          required
                          className="select-field"
                          placeholder={translateFormText('Select experience level')}
                        />
                      )}
                    />
                    
                    <AccessibleInput
                      label={translateFormText('Years of Experience')}
                      fieldKey="yearsOfExperience"
                      type="number"
                      min="0"
                      max="50"
                      {...register('yearsOfExperience', { 
                        required: 'Years of experience is required',
                        min: { value: 0, message: 'Years must be 0 or more' },
                        max: { value: 50, message: 'Years must be 50 or less' }
                      })}
                      error={errors.yearsOfExperience?.message}
                      speak={speak}
                      speakField={speakField}
                      isAudioEnabled={isAudioEnabled}
                      required
                      className="input-field"
                    />
                  </div>
                  
                  <div className="form-grid-full">
                    <AccessibleInput
                      label={translateFormText('Coach Name')}
                      fieldKey="coachName"
                      {...register('coachName')}
                      error={errors.coachName?.message}
                      speak={speak}
                      speakField={speakField}
                      isAudioEnabled={isAudioEnabled}
                      className="input-field"
                    />
                    
                    <AccessibleInput
                      label={translateFormText('Coach Contact')}
                      fieldKey="coachContact"
                      type="tel"
                      {...register('coachContact')}
                      error={errors.coachContact?.message}
                      speak={speak}
                      speakField={speakField}
                      isAudioEnabled={isAudioEnabled}
                      className="input-field"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-blue-800">
                      {translateFormText('Achievements')}
                    </label>
                    <AccessibleTextarea
                      {...register('achievements')}
                      error={errors.achievements?.message}
                      speak={speak}
                      speakField={speakField}
                      isAudioEnabled={isAudioEnabled}
                      className="textarea-field"
                      rows="4"
                      placeholder={translateFormText('List your sports achievements, medals, records, etc.')}
                    />
                  </div>
                </div>

                {/* Disability Information Section */}
                <div className="form-section bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 relative">
                  {/* Section Background Decorative Element */}
                  <div className="absolute top-4 right-4 w-16 h-16 opacity-10 flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                  </div>
                  
                  {/* Para Sports Decorative Image */}
                  {/* <img 
                    src="https://png.pngtree.com/png-clipart/20230227/original/pngtree-olympic-and-paralympic-events-archery-png-image_8965957.png" 
                    alt="Para Sports Archery" 
                    className="absolute top-6 left-6 w-16 h-16 object-contain opacity-20"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  /> */}
                  
                  <h2 className="form-section-title text-blue-900">
                    <div className="form-section-icon bg-gradient-to-br from-blue-500 to-blue-600">
                      <Heart size={24} className="text-white" />
                    </div>
                    {translateFormText('Disability Information')}
                  </h2>
                  
                  <div className="form-grid">
                    <Controller
                      name="disabilityType"
                      control={control}
                      rules={{ required: 'Disability type is required' }}
                      render={({ field }) => (
                        <AccessibleSelect
                          label={translateFormText('Disability Type')}
                          options={disabilityOptions}
                          value={field.value}
                          onChange={(option) => field.onChange(option?.value || '')}
                          error={errors.disabilityType?.message}
                          speak={speak}
                          speakField={speakField}
                          isAudioEnabled={isAudioEnabled}
                          required
                          className="select-field"
                          placeholder={translateFormText('Select disability type')}
                        />
                      )}
                    />
                    
                    <Controller
                      name="disabilityClassification"
                      control={control}
                      render={({ field }) => (
                        <AccessibleSelect
                          label={translateFormText('Disability Classification')}
                          options={disabilityClassificationOptions}
                          value={field.value}
                          onChange={option => field.onChange(option.value)}
                          isClearable
                          placeholder="Select or type classification (e.g., T44, S10, etc.)"
                          error={errors.disabilityClassification}
                          onFocus={() => speakField('Disability Classification')}
                          className="w-full"
                        />
                      )}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-blue-800">
                      {translateFormText('Impairment Description')}
                    </label>
                    <AccessibleTextarea
                      {...register('impairmentDescription', { required: 'Impairment description is required' })}
                      error={errors.impairmentDescription?.message}
                      speak={speak}
                      speakField={speakField}
                      isAudioEnabled={isAudioEnabled}
                      required
                      className="textarea-field"
                      rows="4"
                      placeholder={translateFormText('Please describe your impairment in detail')}
                    />
                  </div>
                </div>

                {/* Medical Information Section */}
                <div className="form-section bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 relative">
                  {/* Section Background Decorative Element */}
                  <div className="absolute top-4 right-4 w-16 h-16 opacity-5 flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                  </div>
                  
                  <h2 className="form-section-title text-blue-900">
                    <div className="form-section-icon bg-gradient-to-br from-blue-500 to-blue-600">
                      <FileText size={24} className="text-white" />
                    </div>
                    {translateFormText('Medical Information')}
                  </h2>
                  
                  <div className="form-grid">
                    <AccessibleInput
                      label={translateFormText('Emergency Contact Name')}
                      fieldKey="emergencyContactName"
                      {...register('emergencyContact.name', { required: 'Emergency contact name is required' })}
                      error={errors.emergencyContact?.name?.message}
                      speak={speak}
                      speakField={speakField}
                      isAudioEnabled={isAudioEnabled}
                      required
                      className="input-field"
                    />
                    
                    <AccessibleInput
                      label={translateFormText('Relationship')}
                      fieldKey="relationship"
                      {...register('emergencyContact.relationship', { required: 'Relationship is required' })}
                      error={errors.emergencyContact?.relationship?.message}
                      speak={speak}
                      speakField={speakField}
                      isAudioEnabled={isAudioEnabled}
                      required
                      className="input-field"
                      placeholder={translateFormText('e.g., Parent, Spouse, Guardian')}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <AccessibleInput
                      label={translateFormText('Emergency Contact Phone')}
                      fieldKey="emergencyContactPhone"
                      type="tel"
                      {...register('emergencyContact.phone', { required: 'Emergency contact phone is required' })}
                      error={errors.emergencyContact?.phone?.message}
                      speak={speak}
                      speakField={speakField}
                      isAudioEnabled={isAudioEnabled}
                      required
                      className="input-field"
                    />
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-blue-800">
                        {translateFormText('Medical Conditions')}
                      </label>
                      <AccessibleTextarea
                        {...register('medicalConditions')}
                        error={errors.medicalConditions?.message}
                        speak={speak}
                        speakField={speakField}
                        isAudioEnabled={isAudioEnabled}
                        className="textarea-field"
                        rows="3"
                        placeholder={translateFormText('List any relevant medical conditions')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-blue-800">
                        {translateFormText('Medications')}
                      </label>
                      <AccessibleTextarea
                        {...register('medications')}
                        error={errors.medications?.message}
                        speak={speak}
                        speakField={speakField}
                        isAudioEnabled={isAudioEnabled}
                        className="textarea-field"
                        rows="3"
                        placeholder={translateFormText('List any medications you are currently taking')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-blue-800">
                        {translateFormText('Allergies')}
                      </label>
                      <AccessibleTextarea
                        {...register('allergies')}
                        error={errors.allergies?.message}
                        speak={speak}
                        speakField={speakField}
                        isAudioEnabled={isAudioEnabled}
                        className="textarea-field"
                        rows="3"
                        placeholder={translateFormText('List any allergies')}
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Photo Section */}
                <div className="form-section bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 relative">
                  {/* Section Background Decorative Element */}
                  <div className="absolute top-4 right-4 w-16 h-16 opacity-5 flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                  </div>
                  
                  <h2 className="form-section-title text-blue-900">
                    <div className="form-section-icon bg-gradient-to-br from-blue-500 to-blue-600">
                      <Camera size={24} className="text-white" />
                    </div>
                    {translateFormText('Profile Photo')}
                  </h2>
                  
                  <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                      isDragActive 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    {photoPreview ? (
                      <div className="space-y-4">
                        <img 
                          src={photoPreview} 
                          alt="Profile preview" 
                          className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white shadow-soft"
                        />
                        <p className="text-blue-700 font-medium">
                          {translateFormText('Click or drag to replace photo')}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-soft flex items-center justify-center">
                          <Upload size={32} className="text-white" />
                        </div>
                        <p className="text-blue-700 font-medium">
                          {isDragActive 
                            ? translateFormText('Drop the photo here') 
                            : translateFormText('Click or drag to upload profile photo')
                          }
                        </p>
                        <p className="text-blue-600 text-sm">
                          {translateFormText('JPG, PNG, GIF up to 5MB')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn-primary text-lg px-12 py-4 btn-disabled"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="loading-spinner h-6 w-6"></div>
                        {translateFormText('Registering Player...')}
                      </>
                    ) : (
                      <>
                        <UserPlus size={24} />
                        {translateFormText('Register Player & Generate ID Card')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </FormLanguageContext.Provider>
        </KeyboardNavigation>
      </div>
    </div>
  );
});

export default PlayerRegistration; 