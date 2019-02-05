#!/usr/bin/env python
# coding: utf-8


###############################################################################
#Fichier contenant les fonction de planification horaire horaire
#Par Arnaud Duhamel et Robin Cavalieri
#Planificateur intelligent
#SOLUTEC Paris
#juillet 2018
###############################################################################


###############################################################################
#LIBRAIRIES
###############################################################################
import datetime
import pandas as pd
import numpy as np
from dataframes import params_toDf, cities_toDf
from datetime import date
import xml.etree.ElementTree as ET
import urllib.request
###############################################################################


###############################################################################
#FONCTIONS
###############################################################################
"""
    Retourne en seconde une heure au format HH:MM
    IN : 
        time_str : str(heure au format HH:MM)    
    OUT : 
        int(heure en seconde)
"""
def get_sec(time_str):
    h, m = time_str.split(':')
    return int(h) * 3600 + int(m) * 60


"""
    Permet à l'utlisateur de planifier sur le plan temporel le trajet 
    Arrêt du trajet à partir de 22h et reprise à 9h
    IN : 
        t_dep : str(heure départ "HH:MM")
        t_arr : str(heure arrivée "HH:MM")
        d_repas : int(temps du repas en seconde)
        df : dataframe avec les paramètres trajets (distance, heuristique, temps)
        result_plan : 
    OUT : 
        str_heures : str(["10:21", "20:10, "", ..."])
"""
def schedule_str(t_dep, t_arr, df, result_plan):
    t_dep_conv=get_sec(t_dep)
    t_arr_conv=get_sec(t_arr)
    index=0
    heures=[t_dep_conv]
    str_heures=[]
    t=t_dep_conv
    for i in range(0, len(result_plan)-1):
        delta=df.loc[((df['cityDep_id']==result_plan[i])&(df['cityArr_id']==result_plan[i+1])) ^ ((df['cityDep_id']==result_plan[i+1])&(df['cityArr_id']==result_plan[i])), 'time'].values[0]
        t=t+delta
        heures.append(t)
    for i in range(0, len(heures)):
        #Arret après 22h
        if(heures[i]>=79200):
            index=i
            break
    #Début de la journée à 9:00
    delta_t=32400-heures[index]
    for k in range(index, len(heures)):
        heures[k]=heures[k]+delta_t
    for x in heures:
        str_heures.append(str(datetime.timedelta(seconds=int(x))))
    print(str_heures)
    return str_heures
###############################################################################


def time_cities(cities):
    cities_time = params_toDf("driving")
    citiesdf = cities_toDf()

    a = []


    listid = []
    for i in range(0, len(cities[0])):
        city_id = citiesdf.loc[(citiesdf)['name']==(cities[0])[i][0], ["id"]]
        listid.append(city_id["id"].item())

    print(listid)
    for i in range (0,len(listid)-1):
        b = cities_time.loc[((cities_time['cityDep_id']==listid[i]) & (cities_time['cityArr_id']==listid[i+1])) | ((cities_time['cityArr_id']==listid[i]) & (cities_time['cityDep_id']==listid[i+1])) , ["time","cityArr_id","cityDep_id"]]

        a.append(round(b["time"].item()/(60*60)))

    print(a)
    return a



def get_budget(ville_dep, vill_ar):
        print(ville_dep)
        print(vill_ar)
        requesturl = "http://free.rome2rio.com/api/1.4/xml/Search?key=PM125tIR" \
        + '&oName=' + ville_dep \
        + '&dName=' + vill_ar \

        #root = ET.parse(urllib.urlopen(requesturl)).getroot()
        tree = ET.parse(urllib.request.urlopen(requesturl))
        #print(tree)
        root = tree.getroot()
        b=0
        for atype in root.findall("{http://www.rome2rio.com/api/1.4/xml}Route"):
            if atype.get('name')=="Drive":
                for indicprice in atype.findall('{http://www.rome2rio.com/api/1.4/xml}IndicativePrice'):
                    #print(indicprice)
                   # print(indicprice.attrib)
                    a = int(indicprice.get('price'))
                    b=b+a
                    #print(a)
                    #print(b)


        b = b//3
        b = str(b)
        b.encode("utf-8")
        return (b + "$")

def get_price_for_each(cities):
    a = []
    for i in range (0,len((cities[0]))-1):

        a.append(get_budget((cities[0][i])[0],(cities[0][i+1])[0]))

    return a





