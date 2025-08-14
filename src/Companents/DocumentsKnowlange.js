import { Image, StyleSheet, Text,TextInput, TextInputBase, TouchableOpacity, View, Modal, FlatList, Platform } from 'react-native'
import React, { useState } from 'react'
import data from './Documentslist';
import { scale, verticalScale,moderateScale } from '../utils/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';


export default function DocumentsKnowlange({ route }) {
  const navigation = useNavigation();
  const { documentId } = route.params;
  const filtredDocument = data.find(doc => doc.id === documentId);

  // Dropdown state'leri
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(filtredDocument?.company?.companyactivity || '');
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(filtredDocument?.company?.companydate || '');
   

  // Takvim state'leri
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDateList, setShowDateList] = useState(false);
  const [showYearList, setShowYearList] = useState(false);

  //Bilgileri güncelleme fonksiyonu
  const [upInputt, setUpInputt] = useState('');


  // Faaliyet alanları listesi
  const activityOptions = [
    'Bilişim Teknolojileri',
    'İnşaat ve Yapı',
    'Turizm ve Otelcilik',
    'Gıda ve İçecek',
    'Tekstil ve Konfeksiyon',
    'Otomotiv',
    'Sağlık Hizmetleri',
    'Eğitim Hizmetleri',
    'Finans ve Bankacılık',
    'Lojistik ve Taşımacılık'
  ];




  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    setIsDropdownVisible(false);
  };

  const handleDateSelect = (day) => {
    setSelectedDay(day);
    const monthName = monthNames[currentMonth];
    const formattedDate = `${day} ${monthName} ${currentYear}`;
    setSelectedDate(formattedDate);
    setIsCalendarVisible(false);
  };

  const handleYearSelect = (year) => {
    setCurrentYear(year);
    setShowYearList(false);
  };

  const generateYearList = () => {
    const years = [];
    // 1900'den 2100'e kadar yıl listesi oluştur
    for (let year = 1970; year <= 2050; year++) {
      years.push(year);
    }
    return years;
  };

  const generateCalendar = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const days = [];
    // Pazar = 0, Pazartesi = 1 olduğu için, Pazartesi ile başlayacak şekilde ayarlayalım
    const adjustedFirstDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;
    
    // Önceki ayın son günlerini ekle
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    
    // Bu ayın günlerini ekle
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isCurrentMonth: true });
    }
    
    // Sonraki ayın günlerini ekleme - ay her ne zaman bitiyorsa orada dur
    // (28, 29, 30 veya 31 günlük aylar için)
    
    return { days, month: currentMonth, year: currentYear };
  };

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const goToPreviousMonth = () => {
    setSelectedDay(null); // Ay değiştiğinde seçili günü sıfırla
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    setSelectedDay(null); // Ay değiştiğinde seçili günü sıfırla
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToPreviousYear = () => {
    setSelectedDay(null); // Yıl değiştiğinde seçili günü sıfırla
    setCurrentYear(currentYear - 1);
  };

  const goToNextYear = () => {
    setSelectedDay(null); // Yıl değiştiğinde seçili günü sıfırla
    setCurrentYear(currentYear + 1);
  };

  const calendar = generateCalendar();


  return (
    <LinearGradient
             colors={['#1b46b5ff', '#711EA2', '#1149D3']} 
             locations={[0, 0.6, 1]}                   
             start={{ x: 0, y: 0.3}}
             end={{ x: 1, y: 1 }}
             style={{ flex: 1 }}
           > 
            <View style={styles.container}>
                 <View style={styles.DocumentHeaderContainer}>
                        <Text style={styles.DocumentHeaderTitle}>Kuruluş Bilgileri</Text>
                        <View style={styles.DocumentsubtitleContainer}>
                            <Image source={require('../Assets/virgo.png')} style={{ width: scale(24), height: verticalScale(24), tintColor: '#ffffff' }}/>
                          <Text style={styles.DocumentHeaderSubtitle}>E imzanızı takınız</Text>
                        </View>
                        

                        </View>
                        <View style={styles.contentsContainer} >
                              <View style={styles.contentsupContainer}>
                                <Text style={{ color: '#ffffff', fontSize: moderateScale(16) }}>Şirketin Resmi Adı ve Unvanı</Text>
                                 <TextInput style={styles.upinput} value={upInputt} onChangeText={setUpInputt} placeholder={filtredDocument.company.companyname} placeholderTextColor={'#000000'}fontWeight={'700'} />

                              </View>
                                <View style={styles.contentsupContainer}>
                                <Text style={{ color: '#ffffff', fontSize: moderateScale(16) }}>Kuruluş Amacı ve Faaliyet Alanları</Text>
                                <View style={styles.contanieriMageContainer}>
                                <TextInput  
                                  style={{color:'#000000',fontWeight:'700',marginRight: scale(23), flex: 1}}
                                  value={selectedActivity}
                                  onChangeText={setSelectedActivity}
                                  editable={false}
                                />
                                <TouchableOpacity onPress={() => setIsDropdownVisible(true)}>
                                   <Image source={require('../Assets/down.png')} style={{ width: scale(24), height: verticalScale(24),marginRight: scale(10) }}/>
                                </TouchableOpacity>
                                
                                </View>
                                 
                              </View>
                               <View style={styles.contentsupContainer}>
                                <Text style={{ color: '#ffffff', fontSize: moderateScale(16) }}>Kuruluş Tarihi</Text>
                                <View style={styles.contanieriMageContainer}>
                                <TextInput  
                                  style={{color:'#000000',fontWeight:'700', flex: 1}}
                                  value={selectedDate}
                                  editable={false}
                                  onChangeText={setSelectedDate}
                                />
                                <TouchableOpacity onPress={() => setIsCalendarVisible(true)}>
                                   <Image source={require('../Assets/calendar.png')} style={{ width: scale(22), height: verticalScale(22),marginRight: scale(10) }}/>
                                </TouchableOpacity>
                                
                                </View>
                                 
                              </View>
                               <TouchableOpacity style={styles.loadButton}>
                            <Text style={{color:'#ffffff'}}> Bilgileri Güncelle</Text>
                        </TouchableOpacity>
                         <TouchableOpacity style={[styles.loadButton,{backgroundColor:'#1154ffff'}]} onPress={() => navigation.goBack()}>
                            <Text style={{color:'#ffffff'}}> Devam  Et</Text>
                        </TouchableOpacity>
                        </View>

                        {/* Dropdown Modal */}
                        <Modal
                          visible={isDropdownVisible}
                          transparent={true}
                          animationType='fade'
                          
                          onRequestClose={() => setIsDropdownVisible(false)}
                        >
                          <TouchableOpacity 
                            style={styles.modalOverlay}
                            onPress={() => setIsDropdownVisible(false)}
                            activeOpacity={1}
                          >
                            <TouchableOpacity 
                              activeOpacity={1}
                              onPress={() => {}}
                            >
                              <LinearGradient
                                colors={['#1b46b5ff', '#711EA2', '#1b46b5ff']}
                                locations={[0, 0.6, 1]}
                                start={{ x: 0, y: 0.3}}
                                end={{ x: 1, y: 1 }}
                                style={styles.dropdownContainer}
                              >
                                <Text style={styles.dropdownTitle}>Faaliyet Alanı Seçin</Text>
                                <FlatList
                                  data={activityOptions}
                                  keyExtractor={(item, index) => index.toString()}
                                  renderItem={({ item }) => (
                                    <TouchableOpacity
                                      style={styles.dropdownItem}
                                      onPress={() => handleActivitySelect(item)}
                                    >
                                      <Text style={styles.dropdownItemText}>{item}</Text>
                                    </TouchableOpacity>
                                  )}
                                />
                              </LinearGradient>
                            </TouchableOpacity>
                          </TouchableOpacity>
                        </Modal>

                        {/* Calendar Modal */}
                        <Modal
                          visible={isCalendarVisible}
                          transparent={true}
                          animationType="fade"
                          onRequestClose={() => {
                            setIsCalendarVisible(false);
                            setShowYearList(false);
                             
                          }}
                        >
                          <TouchableOpacity 
                            style={styles.modalOverlay}
                            onPress={() => {
                              setIsCalendarVisible(false);
                              setShowYearList(false);
                            }}
                            activeOpacity={1}
                          >
                            <TouchableOpacity 
                              activeOpacity={1}
                              onPress={() => {}}
                            >
                              <LinearGradient
                                colors={['#1b46b5ff', '#711EA2', '#1b46b5ff']}
                                locations={[0, 0.6, 1]}
                                start={{ x: 0, y: 0.3}}
                                end={{ x: 1, y: 1 }}
                                style={[styles.calendarContainer, showYearList && styles.calendarContainerExpanded]}
                              >
                                
                                {!showYearList ? (
                                  <>
                                    {/* Yıl Seçici */}
                                    <View style={styles.yearSelector}>
                                      <TouchableOpacity onPress={goToPreviousYear} style={styles.navigationButton}>
                                        <Text style={styles.navigationText}>←</Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity onPress={() => setShowYearList(true)}>
                                        <Text style={styles.yearText}>{currentYear}</Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity onPress={goToNextYear} style={styles.navigationButton}>
                                        <Text style={styles.navigationText}>→</Text>
                                      </TouchableOpacity>
                                    </View>

                                    {/* Ay Seçici */}
                                    <View style={styles.monthSelector}>
                                      <TouchableOpacity onPress={goToPreviousMonth} style={styles.navigationButton}>
                                        <Text style={styles.navigationText}>‹</Text>
                                      </TouchableOpacity>
                                      <Text style={styles.monthText}>{monthNames[currentMonth]}</Text>
                                      <TouchableOpacity onPress={goToNextMonth} style={styles.navigationButton}>
                                        <Text style={styles.navigationText}>›</Text>
                                      </TouchableOpacity>
                                    </View>
                                    
                                    {/* Hafta günleri başlığı */}
                                    <View style={styles.weekDaysContainer}>
                                      {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, index) => (
                                        <Text key={index} style={styles.weekDayText}>{day}</Text>
                                      ))}
                                    </View>
                                    
                                    {/* Takvim günleri */}
                                    <View style={styles.calendarGrid}>
                                      {calendar.days.map((dayObj, index) => (
                                        <TouchableOpacity
                                          key={index}
                                          style={[
                                            styles.calendarDay,
                                            !dayObj.isCurrentMonth && styles.inactiveDay,
                                            dayObj.isCurrentMonth && dayObj.day === selectedDay && styles.selectedDay
                                          ]}
                                          onPress={() => dayObj.isCurrentMonth && handleDateSelect(dayObj.day)}
                                          disabled={!dayObj.isCurrentMonth}
                                        >
                                          <Text style={[
                                            styles.calendarDayText,
                                            !dayObj.isCurrentMonth && styles.inactiveDayText,
                                            dayObj.isCurrentMonth && dayObj.day === selectedDay && styles.selectedDayText
                                          ]}>
                                            {dayObj.day}
                                          </Text>
                                        </TouchableOpacity>
                                      ))}
                                    </View>
                                  </>
                                ) : (
                                  <>
                                    {/* Yıl Listesi */}
                                    <View>
                                      
                                    </View>
                                    <View style={styles.dateListHeader}>
                                      <TouchableOpacity onPress={() => setShowYearList(false)} style={styles.backButton}>
                                        <Text style={styles.backButtonText}>← Geri</Text>
                                      </TouchableOpacity>
                                      <Text style={styles.dateListTitle}>Yıl Seçin</Text>
                                    </View>
                                    <FlatList
                                      data={generateYearList()}
                                      keyExtractor={(item, index) => index.toString()}
                                      renderItem={({ item }) => (
                                        <TouchableOpacity
                                          style={[
                                            styles.dateListItem,
                                            item === currentYear && styles.selectedYearItem
                                          ]}
                                          onPress={() => handleYearSelect(item)}
                                        >
                                          <Text style={[
                                            styles.dateListItemText,
                                            item === currentYear && styles.selectedYearText
                                          ]}>
                                            {item}
                                          </Text>
                                        </TouchableOpacity>
                                      )}
                                      showsVerticalScrollIndicator={true}
                                      contentContainerStyle={{ paddingBottom: verticalScale(20) }}
                                    />
                                  </>
                                )}
                              </LinearGradient>
                            </TouchableOpacity>
                          </TouchableOpacity>
                        </Modal>
                       
            </View>
           </LinearGradient>
  )
}

const styles = StyleSheet.create({
      container:
    {
        flex: 1,
        
    },
    DocumentHeaderContainer:
    {
justifyContent: 'center',
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? verticalScale(80) : verticalScale(50),
      
    },
    DocumentHeaderTitle:
    {
   fontSize: moderateScale(26),
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: verticalScale(10),
    },
    DocumentsubtitleContainer:
    {
        flexDirection: 'row',
        alignItems: 'center',
        
        marginBottom: verticalScale(20),
    },
    DocumentHeaderSubtitle:
    {    
        fontSize: moderateScale(13),
        color: '#fff',
        marginLeft: scale(10),
        fontWeight: '500',
      
    },
    contentsContainer:
    {
        width: '90%',
        height: verticalScale(70),
       
        borderRadius: moderateScale(10),
      
        marginLeft: scale(20),
        
    },
    contentsupContainer:
    {
       
       borderColor: '#ffffff',
       borderRadius: moderateScale(20),
       padding: scale(10),
      marginHorizontal : scale(5),
      marginTop: verticalScale(15),
    },
    upinput:
    {
        color: '#000000',
        fontSize: moderateScale(14),
        marginTop: verticalScale(10),
        paddingLeft: scale(15),
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: moderateScale(10),
        fontWeight: '500',
        width: '100%',
        height: verticalScale(60),
        paddingLeft: scale(10),
        backgroundColor: '#FFFFFF80',
    },
    loadButton:
    {
        backgroundColor: '#FFFFFF80',
        padding: scale(10),
        borderRadius: moderateScale(10),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: verticalScale(20),
        height: verticalScale(60),
         marginHorizontal : scale(15),
    },
    contanieriMageContainer:
    {   borderWidth: 1,
        borderColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
         height: verticalScale(60),
         borderRadius: moderateScale(10),
        backgroundColor: '#FFFFFF80',
        paddingLeft: scale(5),
        marginTop: verticalScale(10),
        paddingRight: scale(18),
        
    },
    modalOverlay: {
        flex: 1,
      
        justifyContent: 'center',
        alignItems: 'center',
       
        
    },
    dropdownContainer: {
        borderRadius: moderateScale(15),
        width:Platform.OS === 'ios' ? scale(320) : scale(320),
        height: Platform.OS === 'ios' ? verticalScale(329) : verticalScale(341),
        marginBottom:Platform.OS==='ios'?verticalScale(48):verticalScale(76),
        
      
        borderRadius:scale(14),
    },
    dropdownTitle: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: verticalScale(15),
        textAlign: 'center',
    },
    dropdownItem: {
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(15),
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: moderateScale(8),
        marginBottom: verticalScale(5),
    },
    dropdownItemText: {
        fontSize: moderateScale(16),
        color: '#ffffff',
        fontWeight: '500',
    },
    calendarContainer: {
        borderRadius: moderateScale(15),
        width: Platform.OS === 'ios' ? scale(320) : scale(320),
        height: Platform.OS === 'ios' ? verticalScale(310) : verticalScale(321),
        padding: scale(20),
        marginBottom: Platform.OS === 'ios' ? verticalScale(70) : verticalScale(95),
     

    },
    calendarContainerExpanded: {
        height: Platform.OS==='ios'?verticalScale(312):verticalScale(325),
        width: Platform.OS==='ios'?scale(315):scale(315),
    },
    dateListHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(15),
        justifyContent: 'space-between',
    },
    backButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(5),
        borderRadius: moderateScale(10),
    },
    backButtonText: {
        color: '#ffffff',
        fontSize: moderateScale(12),
        fontWeight: '600',
    },
    dateListTitle: {
        color: '#ffffff',
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        marginRight: scale(50),
    },
    dateListItem: {
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(15),
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: moderateScale(8),
        marginBottom: verticalScale(3),
    },
    dateListItemText: {
        fontSize: moderateScale(14),
        color: '#ffffff',
        fontWeight: '500',
        textAlign: 'center',
    },
    selectedYearItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    selectedYearText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    yearSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(5),
        paddingHorizontal: scale(10),
    },
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(15),
        paddingHorizontal: scale(10),
    },
    navigationButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: scale(30),
        height: verticalScale(30),
        borderRadius: moderateScale(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    navigationText: {
        color: '#ffffff',
        fontSize: moderateScale(15),
        fontWeight: 'bold',
    },
    yearText: {
        color: '#ffffff',
        fontSize: moderateScale(15),
        fontWeight: 'bold',
    },
    monthText: {
        color: '#ffffff',
        fontSize: moderateScale(15),
        fontWeight: '600',
    },
    calendarTitle: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: verticalScale(20),
        textAlign: 'center',
    },
    weekDaysContainer: {
        flexDirection: 'row',
        marginBottom: verticalScale(10),
        
        width: '100%',
    },
    weekDayText: {
        color: '#ffffff',
        fontSize: moderateScale(12),
        fontWeight: 'bold',
        textAlign: 'center',
        width: '14.28%', // 100% / 7 = 14.28% - Gün kutularıyla aynı genişlik
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: verticalScale(20),
       
        width: '100%',
    },
    calendarDay: {
        width: '14.28%', // 100% / 7 = 14.28% - Her satırda tam 7 kutu
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(6),
        borderRadius: moderateScale(32),
       
    },
    selectedDay: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
       
    },
    inactiveDay: {
        backgroundColor: 'transparent',
    },
    emptyDay: {
        backgroundColor: 'transparent',
    },
    calendarDayText: {
        color: '#ffffff',
        fontSize: moderateScale(14),
        fontWeight: '500',
    },
    inactiveDayText: {
        color: 'rgba(255, 255, 255, 0.3)',
        fontSize: moderateScale(12),
    },
    selectedDayText: {
        color: '#1b46b5ff',
        fontWeight: 'bold',
    },
    

})