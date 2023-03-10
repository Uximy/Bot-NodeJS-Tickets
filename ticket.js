const fs = require('fs');
const { Client, GatewayIntentBits, PermissionsBitField, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });
let config = require('./Config/config.json');
let dictionary = require('./lang/dictionary.json');
const role_config = require('./BotRole.json');
const lang_config = require('./LangButton.json');
const filter = async (i) => 
    i.customId === 'createticket' ||
    i.customId === 'closeticket';
let count = 1;

function getLangCategory(i)
{
    let LangText = '';
    switch (i) 
    {
        case config.id_category_ticket_ru:
            LangText = 'ru';
            break;

        default:
            LangText = 'en';
            break;
    }

    return LangText;
}

function lang_text(i) {
    let LangText = '';
    switch (i) 
    {
        case config.channel_ru_ticket_id:
            LangText = 'ru';
            break;

        default:
            LangText = 'en';
            break;
    }

    return LangText;
}

function lang_category(i) {
    let category = '';
    switch (i.channel.id) {
        case config.channel_ru_ticket_id:
            category = config.id_category_ticket_ru;
            break;

        default:
            category = config.id_category_ticket_en;
            break;
    }

    return category;
}

function create_blockInfo_ticket(id_channel) {
    setTimeout(() => {
        const channel = client.channels.cache.get(id_channel);

        // let messages = CreateEmbedBuilder(lang_text(id_channel));
        // let buttons = CreateButtons(lang_text(id_channel));
        // channel.send({embeds: [messages.message_1], components: [new ActionRowBuilder().addComponents(buttons.button_1)]}); //!отправлять сообщение в чат
       
        const collector = channel.createMessageComponentCollector({filter});
        const guild = client.guilds.cache.get(config.Guild_id);
        
        collector.on('collect', async i => {
            if (i.customId === 'createticket') {
                createTicket(guild, i);
            }
        });

        console.log(`"create" button in chat "${channel.name}" restarted`);
    }, 10000);
}

function buffery(old_count) {
    let Buffery = 0;
    if (old_count == null) {
        Buffery = config.count_ticket;
    }else{
        Buffery = old_count;
    }
    while(Buffery.toString().length < 4)
    {
        Buffery = '0' + Buffery;
    }
    return Buffery;
}

function closeTicket(guild, new_channel, i_new, Buffery, mess) {
        new_channel.edit({
            // name: `${dictionary.ru.channel_closed_ticket_name}${Buffery}`,
            name: `${(getLangCategory(i_new.channel.parentId) == 'ru') ? (dictionary.ru.channel_closed_ticket_name) : (dictionary.eu.channel_closed_ticket_name)}${Buffery}`,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone,
                    deny: [
                        PermissionsBitField['Flags'].ManageChannels,
                        PermissionsBitField['Flags'].CreateInstantInvite,
                        PermissionsBitField['Flags'].ChangeNickname,
                        PermissionsBitField['Flags'].SendTTSMessages,
                        PermissionsBitField['Flags'].SendMessagesInThreads,
                        PermissionsBitField['Flags'].UseApplicationCommands,
                        PermissionsBitField['Flags'].SendMessages,
                        PermissionsBitField['Flags'].ReadMessageHistory,
                        PermissionsBitField['Flags'].ViewChannel,
                        PermissionsBitField['Flags'].MentionEveryone
                    ]
                },
                {
                    id: config.id_bot,
                    allow: [
                        PermissionsBitField['Flags'].ViewChannel,
                        PermissionsBitField['Flags'].ReadMessageHistory,
                        PermissionsBitField['Flags'].SendMessages
                    ]
                }
            ],
            parent: client.channels.cache.find(ct => ct.name.startsWith(config.name_category_close_ticket)),
        })
        .catch(function () {
            const channel_error = client.channels.cache.find(ct => ct.name.startsWith(config.name_category_close_ticket));
            
            channel_error.edit({
                name: `${channel_error.name} (Архив)`
            })

            if (channel_error.parentId == null) {
                config.count_category += count++;
                Rewriting(config);

                const new_category = guild.channels.create({
                    name: `Закрытые тикеты_${config.count_category}`,
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone,
                            deny: [
                                PermissionsBitField['Flags'].ManageChannels,
                                PermissionsBitField['Flags'].CreateInstantInvite,
                                PermissionsBitField['Flags'].ChangeNickname,
                                PermissionsBitField['Flags'].SendTTSMessages,
                                PermissionsBitField['Flags'].SendMessagesInThreads,
                                PermissionsBitField['Flags'].UseApplicationCommands,
                                PermissionsBitField['Flags'].SendMessages,
                                PermissionsBitField['Flags'].ReadMessageHistory,
                                PermissionsBitField['Flags'].ViewChannel,
                                PermissionsBitField['Flags'].MentionEveryone
                            ]
                        },
                    ],
                    position: client.channels.cache.size + 1
                    })

                new_category.then(channel_new => {
                    config.name_category_close_ticket = channel_new.name
                    Rewriting(config);

                    new_channel.edit({
                        name: `${(getLangCategory(i_new.channel.parentId) == 'ru') ? (dictionary.ru.channel_closed_ticket_name) : (dictionary.eu.channel_closed_ticket_name)}${Buffery}`,
                        permissionOverwrites: [
                            {
                                id: guild.roles.everyone,
                                deny: [
                                    PermissionsBitField['Flags'].ManageChannels,
                                    PermissionsBitField['Flags'].CreateInstantInvite,
                                    PermissionsBitField['Flags'].ChangeNickname,
                                    PermissionsBitField['Flags'].SendTTSMessages,
                                    PermissionsBitField['Flags'].SendMessagesInThreads,
                                    PermissionsBitField['Flags'].UseApplicationCommands,
                                    PermissionsBitField['Flags'].SendMessages,
                                    PermissionsBitField['Flags'].ReadMessageHistory,
                                    PermissionsBitField['Flags'].ViewChannel,
                                    PermissionsBitField['Flags'].MentionEveryone
                                ]
                            },
                            {
                                id: config.id_bot,
                                allow: [
                                    PermissionsBitField['Flags'].ViewChannel,
                                    PermissionsBitField['Flags'].ReadMessageHistory,
                                    PermissionsBitField['Flags'].SendMessages
                                ]
                            }
                        ],
                        parent: client.channels.cache.find(ct => ct.name.startsWith(config.name_category_close_ticket)),
                    })
                })

                return new_channel;
            }
        })

    i_new.reply({content: `${i_new.user} ${(getLangCategory(i_new.channel.parentId) == 'ru') ? (dictionary.ru.content_close_ticket) : (dictionary.eu.content_close_ticket)} #${Buffery}`});

    mess.delete();
}

function createTicket(guild, i) {
    let Buffery = buffery();
    return guild.channels.create({
        name: `${(lang_text(i.channel.id) == 'ru') ? (dictionary.ru.channel_ticket_name) : (dictionary.eu.channel_ticket_name)}${Buffery}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: guild.roles.everyone,
                deny: [
                    PermissionsBitField['Flags'].ManageChannels,
                    PermissionsBitField['Flags'].CreateInstantInvite,
                    PermissionsBitField['Flags'].ChangeNickname,
                    PermissionsBitField['Flags'].SendTTSMessages,
                    PermissionsBitField['Flags'].SendMessagesInThreads,
                    PermissionsBitField['Flags'].UseApplicationCommands,
                    PermissionsBitField['Flags'].SendMessages,
                    PermissionsBitField['Flags'].ReadMessageHistory,
                    PermissionsBitField['Flags'].ViewChannel,
                    PermissionsBitField['Flags'].MentionEveryone
                ]
            },
            {
                id: i.user.id,
                allow: [
                    PermissionsBitField['Flags'].UseApplicationCommands,
                    PermissionsBitField['Flags'].SendMessages,
                    PermissionsBitField['Flags'].ReadMessageHistory,
                    PermissionsBitField['Flags'].ViewChannel
                ],
                deny: [
                    PermissionsBitField['Flags'].ManageChannels,
                    PermissionsBitField['Flags'].CreateInstantInvite,
                    PermissionsBitField['Flags'].ChangeNickname,
                    PermissionsBitField['Flags'].SendTTSMessages,
                    PermissionsBitField['Flags'].SendMessagesInThreads,
                    PermissionsBitField['Flags'].MentionEveryone
                ]
            },
            {
                id: config.id_bot,
                allow: [
                    PermissionsBitField['Flags'].ViewChannel,
                    PermissionsBitField['Flags'].ReadMessageHistory,
                    PermissionsBitField['Flags'].SendMessages
                ]
            },
            {
                id: guild.roles.cache.get(config.ticket_admin_ru).id,
                allow: [
                    PermissionsBitField['Flags'].ViewChannel,
                    PermissionsBitField['Flags'].ReadMessageHistory,
                    PermissionsBitField['Flags'].SendMessages
                ],
                deny: [
                    PermissionsBitField['Flags'].CreateInstantInvite,
                    PermissionsBitField['Flags'].ChangeNickname,
                    PermissionsBitField['Flags'].MentionEveryone
                ]
            }
        ],
        parent: lang_category(i),
        }).then(new_channel => {
            i.reply({content: `${(lang_text(i.channel.id) == 'ru') ? (dictionary.ru.content_create_ticket) : (dictionary.eu.content_create_ticket)} <#${new_channel.id}>`, ephemeral: true})
            config.count_ticket++;
            Rewriting(config);

            let mes = CreateEmbedBuilder(lang_text(i.channel.id));
            let but = CreateButtons(lang_text(i.channel.id));

            new_channel.send({embeds: [mes.message_2], components: [new ActionRowBuilder().addComponents(but.button_2)]})
                .then(message => {
                    new_channel.send({content: ` ${(lang_text(i.channel.id) == 'ru') ? (dictionary.ru.notification_admin_add_ticket) : (dictionary.eu.notification_admin_add_ticket)} ${guild.roles.cache.get(config.ticket_admin_ru).toString()}`}); //!ОТПРАВКА СООБЩЕНИЕ АДМИНАМ О СОЗДАНИИ НОВОГО ТИКЕТА!!!!


                    const new_collector = new_channel.createMessageComponentCollector({filter});
                    
                    new_collector.on('collect', async i_new => {
                        if (i_new.customId == 'closeticket') {
                            closeTicket(guild, new_channel, i_new, Buffery, message); //@f ВЫПОЛНЕНИЕ ФУНКЦИИ ЗАКРЫТИЕ ТИКЕТА
                        }
                    })
                });//! ОТПРАВКА БЛОКА О ЗАКРЫТИЕ ТИКЕТА!!!

            // new_channel.send({content: (lang_text(i.channel.id) == 'ru') ? (dictionary.ru.content_please_question) : (dictionary.eu.content_please_question)}); //! ОТПРАВКА СООБЩЕНИЕ "Напишите пожалуйста ваш интересующий вопрос."


            
        })
        .catch(console.error);
}

function CreateEmbedBuilder(lang)
{
        const message_1 = new EmbedBuilder()
        .setColor('#FA747D')
        .setTitle((lang == 'ru') ? (dictionary.ru.embed_builder.message_1.title_main) : (dictionary.eu.embed_builder.message_1.title_main)) 
        .setAuthor({name: (lang == 'ru') ? (dictionary.ru.embed_builder.message_1.author) : (dictionary.eu.embed_builder.message_1.author)})
        .setTitle((lang == 'ru') ? (dictionary.ru.embed_builder.message_1.title_additional) : (dictionary.eu.embed_builder.message_1.title_additional))
        .setDescription((lang == 'ru') ? (dictionary.ru.embed_builder.message_1.description) : (dictionary.eu.embed_builder.message_1.description))


         const message_2 = new EmbedBuilder()
            .setColor('#FA747D')
            .setTitle((lang == 'ru') ? (dictionary.ru.embed_builder.message_2.title_main) : (dictionary.eu.embed_builder.message_2.title_main)) 
            .setAuthor({name: (lang == 'ru') ? (dictionary.ru.embed_builder.message_2.author) : (dictionary.eu.embed_builder.message_2.author)})
            .setTitle((lang == 'ru') ? (dictionary.ru.embed_builder.message_2.title_additional) : (dictionary.eu.embed_builder.message_2.title_additional))
            .setDescription((lang == 'ru') ? (dictionary.ru.embed_builder.message_2.description) : (dictionary.eu.embed_builder.message_2.description))
    
    return {message_1, message_2};
}

function CreateButtons(lang)
{
    const button_1 = new ButtonBuilder()
        .setCustomId((lang == 'ru') ? (dictionary.ru.buttons.button_1.id) : (dictionary.eu.buttons.button_1.id))
        .setLabel((lang == 'ru') ? (dictionary.ru.buttons.button_1.label) : (dictionary.eu.buttons.button_1.label))
        .setStyle(ButtonStyle.Success)
        .setEmoji((lang == 'ru') ? (dictionary.ru.buttons.button_1.emoji) : (dictionary.eu.buttons.button_1.emoji))


    const button_2 = new ButtonBuilder()
        .setCustomId((lang == 'ru') ? (dictionary.ru.buttons.button_2.id) : (dictionary.eu.buttons.button_2.id))
        .setLabel((lang == 'ru') ? (dictionary.ru.buttons.button_2.label) : (dictionary.eu.buttons.button_2.label))
        .setStyle(ButtonStyle.Danger)
        .setEmoji((lang == 'ru') ? (dictionary.ru.buttons.button_2.emoji) : (dictionary.eu.buttons.button_2.emoji))

    return {button_1, button_2};
}

function role_add() 
{
    const channel = client.channels.cache.get(config.get_role_channel_id);
    
    console.log(`"role add" button in chat "${channel.name}" restarted`);

    let lang = '';

    const filter_lang = async (i) => 
    {
        for(let j = 0; j < lang_config; j++)
        {
            if(i.customId === lang_config[j].custom_Id) return true; 
        }
    };

    const LanguageMessage = new EmbedBuilder()
    .setColor('#C70039')
    .setTitle('Выбери регион | Choose region') 


    let LangBufferyArray = [];
    for(let i = 0; i < lang_config.length; i++)
    {   
        LangBufferyArray[i] = new ButtonBuilder()
            .setCustomId(lang_config[i].custom_id)
            .setLabel(lang_config[i].role_name)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(lang_config[i].icon)
    }

    const controller_lang = channel.createMessageComponentCollector({filter_lang});

    controller_lang.on('collect', async i_new_lang => {
        switch (i_new_lang.customId) {
            case 'ru':
                lang = 'ru'; 
                break;
            case 'eu':
                lang = 'eu'; 
                break;
        }

        let BufferyArray = [];
        for(let i = 0; i < role_config.length; i++)
        {
            BufferyArray[i] = new ButtonBuilder()
                .setCustomId(role_config[i].custom_id)
                .setLabel(role_config[i].role_name)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(role_config[i].icon)
        }
    
        const RoleGiveMessage = new EmbedBuilder()
        .setColor('#C70039')
        .setTitle(lang == 'ru' ? (dictionary.ru.give_role) : (dictionary.eu.give_role)) 
        .setDescription(lang == 'ru' ? (dictionary.ru.hello_role) : (dictionary.eu.hello_role))

        if (i_new_lang.customId == 'ru') {
            i_new_lang.reply({embeds: [RoleGiveMessage], components: [new ActionRowBuilder().addComponents(...BufferyArray)], ephemeral: true});
        }
        else if(i_new_lang.customId == 'eu'){
            i_new_lang.reply({embeds: [RoleGiveMessage], components: [new ActionRowBuilder().addComponents(...BufferyArray)], ephemeral: true});
        }
    })
    
    // channel.send({embeds: [LanguageMessage], components: [new ActionRowBuilder().addComponents(...LangBufferyArray)]}); // ВЫВОД СООБЩЕНИЕ ВЫБОР ЯЗЫКА (СЛАВА ЭТО ВЫВОД СООБЩЕНИЕ ДЛЯ ВЫБОРА ЯЗЫКАААААААА)
        
        const role_filter = async (i) => 
        {
            for(let j = 0; j < role_config; j++)
            {
                if(i.customId === role_config[j].custom_Id) return true; 
            }
        };
        
        const new_collector = channel.createMessageComponentCollector({role_filter});
        
        new_collector.on('collect', async i_new => 
        {
        const guild = client.guilds.cache.get(config.Guild_id);

        for(let i = 0; i < role_config.length; i++)
        {
            if (i_new.customId == role_config[i].custom_id)
            {
                const name_role = guild.roles.cache.get(role_config[i].role_id).name;
                let bBool = false;
                for(let j = 0; j < i_new.member._roles.length; j++)
                {
                    if(i_new.member._roles[j] == role_config[i].role_id) 
                    {
                        i_new.member.roles.remove(guild.roles.cache.get(role_config[i].role_id));
                        try
                        {
                            await i_new.reply({content: lang == 'ru' ? (`${dictionary.ru.remove_role_messages.message_1 + ' ' +name_role + ' ' + dictionary.ru.remove_role_messages.message_2 }`) : (`${dictionary.eu.remove_role_messages.message_1 + ' ' +name_role + ' ' + dictionary.eu.remove_role_messages.message_2 }`), ephemeral: true})
                        } catch {}
                        bBool = true; break;
                    }
                }
                if(bBool == false)
                {
                    i_new.member.roles.add(guild.roles.cache.get(role_config[i].role_id));
                    try
                    {
                        await i_new.reply({content: lang == 'ru' ? (`${dictionary.ru.add_role_messages.message_1 + ' ' +name_role + ' ' + dictionary.ru.add_role_messages.message_2 }`) : (`${dictionary.eu.add_role_messages.message_1 + ' ' +name_role + ' ' + dictionary.eu.add_role_messages.message_2 }`), ephemeral: true})
                    } catch {}
                }
                break;
            }
        }
    })
    
}


(async () => {
    try {
        create_blockInfo_ticket(config.channel_ru_ticket_id);
        create_blockInfo_ticket(config.channel_en_ticket_id);
    } catch (error) {
        console.error(error);
    }
})();

client.on('ready', async () => {
    console.log(`Bot logged in as ${client.user.tag}!`);

    setTimeout(() => {
        const guild = client.guilds.cache.get(config.Guild_id);

        const category_ru_ticket = guild.channels.cache.get(config.id_category_ticket_ru)
        const category_eu_ticket = guild.channels.cache.get(config.id_category_ticket_en);

        const filterTypeCategory = guild.channels.cache.filter(test => test.type == ChannelType.GuildCategory);

        const ChannelsText = guild.channels.cache.filter(test => test.type == ChannelType.GuildText);

        

        filterTypeCategory.filter(category => {
            if (category.name == category_ru_ticket.name) {

                let channel_ticket = ChannelsText.filter(parentId => parentId.parentId === category.id);
                
                channel_ticket.forEach(a => {
                    
                    const reg = /^(?!$)тикет-[0-9]+/gmus
                    
                    if (a.name.match(reg) == a.name) {

                        const old_regexp = /[0-9]+/gm

                        const Buffery = a.name.match(old_regexp);

                            const collector = a.createMessageComponentCollector({filter});     
                            
                            collector.on('collect', async i => {
                                if (i.customId === 'closeticket') {
                                    closeTicket(guild, a, i, Buffery, i.message); //@f ВЫПОЛНЕНИЕ ФУНКЦИИ ЗАКРЫТИЕ ТИКЕТА
                                }
                            });
                    }
                })

            }else if(category.name == category_eu_ticket.name){
                let channel_ticket = ChannelsText.filter(parentId => parentId.parentId === category.id);

                channel_ticket.forEach(a => {
                    
                    const reg = /^(?!$)ticket-[0-9]+/gmus
                    
                    if (a.name.match(reg) == a.name) {

                        const old_regexp = /[0-9]+/gm

                        const Buffery = a.name.match(old_regexp);

                            const collector = a.createMessageComponentCollector({filter});     
                            
                            collector.on('collect', async i => {
                                if (i.customId === 'closeticket') {
                                    closeTicket(guild, a, i, Buffery, i.message); //@f ВЫПОЛНЕНИЕ ФУНКЦИИ ЗАКРЫТИЕ ТИКЕТА
                                }
                            });
                    }
                    
                })
            }
        });
    console.log(`"close" button in category ${category_ru_ticket.name} restarted`);
    console.log(`"close" button in category ${category_eu_ticket.name} restarted`);
    }, 10000);

    role_add();
});

function Rewriting(newJson)
{
    fs.writeFileSync('./Config/config.json', JSON.stringify(newJson));
}

client.login(config.Token);