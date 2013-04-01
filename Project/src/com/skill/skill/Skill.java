/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.skill.skill;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;

import android.util.Log;

import org.apache.cordova.*;

public class Skill extends DroidGap
{

    public boolean isOnline() {
      ConnectivityManager cm =
          (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
      NetworkInfo netInfo = cm.getActiveNetworkInfo();
      if (netInfo != null && netInfo.isConnectedOrConnecting()) {
          return true;
      }
      return false;
    }

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.setIntegerProperty("splashscreen", R.drawable.skill_big);
        
        if(isOnline())
        {
        	super.loadUrl(Config.getStartUrl(), 10000);
        }
        else
        {
        try {
        	//SKAPA EN ANNAN F�R IOS!!!!!
        	
            AlertDialog alertDialog = new AlertDialog.Builder(this).create();
            alertDialog.setTitle("Skill");
            alertDialog.setMessage("Hittade ingen internetanslutning");
            
            //L�gg till skills icon??
           // alertDialog.setIcon(R.drawable.alerticon);
            alertDialog.setButton("OK", new DialogInterface.OnClickListener() {
               public void onClick(DialogInterface dialog, int which) {
                 finish();

               }
            });

            alertDialog.show();
            }
        catch(Exception e){
                
            }
        }
        
        


    }

  
    
    
}

