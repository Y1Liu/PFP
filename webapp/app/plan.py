#!/usr/bin/env python
# coding: utf-8 


###############################################################################
#Fichier contenant les fonction de planification
#Par Arnaud Duhamel et Robin Cavalieri
#Planificateur intelligent
#SOLUTEC Paris
#juin 2018
###############################################################################


###############################################################################
#LIBRAIRIES
###############################################################################
from computing import get_graph_matrix, init_matrix, get_classement
import pandas as pd
from graphnode import *###############################################################################
from schedule import time_cities, schedule_str, get_price_for_each
from dataframes import params_toDf
from datetime import date



###############################################################################
#FONCTIONS
###############################################################################
#Obtenir tous les enfants d'un noeud parent
"""
    IN : 
        node : noeud père
        df : matrice de données graphe (get_graph_matrix)
        overallScore : Dataframe city_id - score
        target : noeud cible
        optimization : Type d'otpimisation 'distance', 'time', 'affinity'
        filtre : Matrice 'df' filtrée par les conditions utilisateur
        distance_begin : distance réelle cumulée     
    OUT : 
        liste de nodes  
"""
def children(node, df, overallScore, target, optimization, filtre, distance_begin):
    children=[]
    d1=filtre.loc[filtre['cityDep_id']==node.city]['cityArr_id']


    d2=filtre.loc[filtre['cityArr_id']==node.city]['cityDep_id']
    d2=pd.concat([d1, d2])
    temp=d2.values[:]
    #Renvoie un tableau de noeuds
    for value in temp : 
        if(value != target.city):
            try:
                score=overallScore.loc[overallScore['City_id']==value]['Score'].values[0]
                parent=node
                H=df.loc[((df['cityDep_id']==value)&(df['cityArr_id']==target.city))|((df['cityDep_id']==target.city)&(df['cityArr_id']==value))]['heuristic'].values[0]
                G=df.loc[((df['cityDep_id']==value)&(df['cityArr_id']==target.city))|((df['cityDep_id']==target.city)&(df['cityArr_id']==value))][optimization].values[0]+distance_begin
                child=Node(value,score,parent,H,G)
                children.append(child)
            except:
                score=0
                parent=node
                H=df.loc[((df['cityDep_id']==value)&(df['cityArr_id']==target.city))|((df['cityDep_id']==target.city)&(df['cityArr_id']==value))]['heuristic'].values[0]
                G=df.loc[((df['cityDep_id']==value)&(df['cityArr_id']==target.city))|((df['cityDep_id']==target.city)&(df['cityArr_id']==value))][optimization].values[0]+distance_begin
                child=Node(value,score,parent,H,G)
                children.append(child) 
        else : 
            children.append(target)
    return children


#Obtenir le noeud suivant en fonction de G et H 
"""
    IN : liste de nodes
         overall_score : dataframe score de chaque ville 
         optimization : 'time', 'distance', 'affinity'
         max_G : maximum distance 
         max_H : maximum heuristique
    OUT : node
"""
def get_best_child(liste, overall_score, optimization, max_G, max_H):
    for i in range(0, len(liste)):
        for j in range(i+1, len(liste)):
            x1=liste[i].H
            y1=liste[i].G
            x2=liste[j].H
            y2=liste[j].G
            try:
                score_city1=overall_score.loc[overall_score['City_id']==liste[i].city]['Score'].values[0]
            except:
                score_city1=0.1
            try:
                score_city2=overall_score.loc[overall_score['City_id']==liste[j].city]['Score'].values[0]
            except:
                score_city2=0.1
            if optimization=="affinity":
                if((x1/max_G + y1/max_H)*score_city2 > (x2/max_G + y2/max_H)*score_city1):
                    tmp=liste[i]
                    liste[i]=liste[j]
                    liste[j]=tmp
            else:
                if((x1/max_G+y1/max_H)>(x2/max_G+y2/max_H)):
                    tmp=liste[i]
                    liste[i]=liste[j]
                    liste[j]=tmp
    return(liste[0])
 

"""
    IN : 
        start : node
        target : node
        df : matrice de données graphe (get_graph_matrix)
        overallScore : Dataframe city_id - score
        optimization : Type d'otpimisation 'distance', 'time', 'affinity'
        filtre : Matrice 'df' filtrée par les conditions utilisateur
    OUT :   
        result_name : tableau avec les noms et scores de chaque étape 
        result_id : tableau avec les id chaque étape
"""
"""
    1000 : POINT DE DEPART
    10000 : POINT D'ARRIVEE
    >= 100000 : escales 
"""
def get_path(start, target, df, overall_score, optimization, filtre, df_cities, add_dep, add_arr, waypoint):
    result_names=[]    
    stack=[]
    result_id=[]
    stack.append(start)
    pere=start
    tmp=0
    distance_begin=0
    for k in range(0,len(waypoint)+1):
        if k<(len(waypoint)-1):
            target_id=100000+k
            next_target=Node(target_id, 0, None, 0, 0)
        elif k==(len(waypoint)-1):
            target_id = 100000 + k
            next_target = Node(target_id, 0, None, 0, 0)
        elif k==len(waypoint):
            target_id = target.city
            next_target = Node(target_id, 0, None, 0, 0)
        while(tmp!=next_target.city):
            x=children(pere, df, overall_score, next_target, 'distance', filtre, distance_begin)

            temp=x
            for node_s in stack:
                for node_c in x:
                    if(node_s.city==node_c.city):
                        temp.remove(node_c)
            max_distance=df['distance'].max()
            if next_target in x :
                child=next_target
            else:
                try:
                    child = get_best_child(temp, overall_score, optimization, max_distance, df['heuristic'].max())
                except:
                    return(-1)
            stack.append(child)
            pere=child
            tmp=stack[-1].city
            print("TMP : "+ str(tmp))
            distance_begin += pere.G /max_distance
    for obj in stack:
        result_id.append(obj.city)
    ###########################################################################
    for obj in result_id:
        if(obj<100):
            result_names.append([df_cities.iloc[int(obj)-1]['name'], round(overall_score.loc[overall_score['City_id']==obj]['Score'].values[0],2)])
        elif(obj==1000):
            result_names.append([add_dep, 0])
        elif(obj==10000):
            result_names.append([add_arr, 0])
        elif(obj >= 100000):
            idx=obj-100000
            result_names.append([waypoint[idx], 0])
    return (result_names, result_id)
"""
def get_todolist(arr, tag) :
    place_info = pd.read_csv('../../data/all_places.csv', encoding = 'utf-8')
    info_ville = pd.read_csv('../../data/cities.csv' , encoding = 'utf-8')
    tag_place = pd.read_csv('../../data/list_tags_places.csv', encoding = 'utf-8')

    #on recupere l'id de la ville d'arriveé
    ville_arr = info_ville[info_ville["name"] == arr]
    id_vill_arr = ville_arr['id']
    id_vill_arr.reset_index(drop=True)
    list_act_ville_arr = place_info[place_info['city_id'] == ville_arr['id'].item()]

    list_act_lie_tag = []
    for i in range(0, len(tag)):
        list_act_lie_tag.append(list_act_ville_arr.merge(tag_place[tag_place['tag'] == tag[i]], left_on='id', right_on='id', how='inner'))
    return ( (list_act_lie_tag[1])['name'], (list_act_lie_tag[0])['name'])
"""
def get_lat_lng(city) :
    a=[]
    info_ville = pd.read_csv('../../data/cities.csv' , encoding = 'utf-8', names = ["id", "name", "lat", "lng"])

    #on recupere l'id de la ville d'arriveé
    ville_arr = info_ville.loc[info_ville["name"] == city, ['lat','lng']]

    a.append(ville_arr['lat'].item())
    a.append((ville_arr['lng'].item()))
    return a

"""
print(get_lat_lng('Marseille'))


datas=init_matrix()
tags=['Art', 'Museum']
overall_score = get_classement(datas[2], tags, datas[1], datas[3], datas[0])[0]
start=Node(1000, 0, None, 0, 0)
target=Node(10000, 0, None, 0, 0)
add_dep='Lille'
add_arr='Marseille'
escale=['Bordeaux']
t_max=7200
d_max=400000
mode='driving'
optimisation='time'
dtfr=get_graph_matrix(add_dep, add_arr, escale, mode, overall_score)
#dtfr.to_csv("trajet_test.csv")
df_filtered = dtfr.loc[(dtfr['distance']<d_max) & (dtfr['distance'] > 50000)]
print(schedule_str("9:00", "22:00", dtfr, get_path(start, target, dtfr, overall_score, optimisation, df_filtered, datas[0], add_dep, add_arr, escale)[1])
)

#planif(date(2019, 2, 2),date(2019,2 , 3),get_path(start, target, dtfr, overall_score, optimisation, df_filtered, datas[0], add_dep, add_arr, escale))
print(get_price_for_each(get_path(start, target, dtfr, overall_score, optimisation, df_filtered, datas[0], add_dep, add_arr, escale)))
print(((get_path(start, target, dtfr, overall_score, optimisation, df_filtered, datas[0], add_dep, add_arr, escale))))

#print(get_todolist(add_arr, tags))
"""
###############################################################################